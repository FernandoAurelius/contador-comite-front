import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  setDoc,
  Timestamp
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/firebase/config';
import { BankStatement, GoalStatus } from '@/types/BankStatement';

const STATEMENTS_COLLECTION = 'bankStatements';
const GOAL_DOC = 'goalStatus';
const GOAL_COLLECTION = 'goals';

export default {
  // Obter todos os extratos bancários
  async getStatements(): Promise<BankStatement[]> {
    try {
      const q = query(
        collection(db, STATEMENTS_COLLECTION),
        orderBy('createdAt', 'desc')
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: (doc.data().createdAt as Timestamp).toDate(),
        updatedAt: (doc.data().updatedAt as Timestamp).toDate()
      } as BankStatement));
    } catch (error) {
      console.error('Erro ao obter extratos:', error);
      throw error;
    }
  },

  // Obter extratos de um período específico
  async getStatementsByPeriod(period: string): Promise<BankStatement[]> {
    try {
      const q = query(
        collection(db, STATEMENTS_COLLECTION),
        where('period', '==', period),
        orderBy('createdAt', 'desc')
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: (doc.data().createdAt as Timestamp).toDate(),
        updatedAt: (doc.data().updatedAt as Timestamp).toDate()
      } as BankStatement));
    } catch (error) {
      console.error('Erro ao obter extratos por período:', error);
      throw error;
    }
  },

  // Adicionar um novo extrato
  async addStatement(statement: Omit<BankStatement, 'id' | 'createdAt' | 'updatedAt'>, file?: File): Promise<BankStatement> {
    try {
      let attachmentUrl = '';

      // Fazer upload do arquivo, se houver
      if (file) {
        const storageRef = ref(storage, `statements/${Date.now()}_${file.name}`);
        await uploadBytes(storageRef, file);
        attachmentUrl = await getDownloadURL(storageRef);
      }

      const docRef = await addDoc(collection(db, STATEMENTS_COLLECTION), {
        ...statement,
        attachmentUrl,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      // Atualizar status da meta
      await this.updateGoalStatus();

      // Retornar o item criado com o ID gerado
      return {
        id: docRef.id,
        ...statement,
        attachmentUrl,
        createdAt: new Date(),
        updatedAt: new Date()
      };
    } catch (error) {
      console.error('Erro ao adicionar extrato:', error);
      throw error;
    }
  },

  // Atualizar um extrato existente
  async updateStatement(id: string, statement: Partial<BankStatement>, file?: File): Promise<BankStatement> {
    try {
      const updateData: Record<string, any> = {
        ...statement,
        updatedAt: serverTimestamp()
      };

      // Fazer upload do arquivo, se houver um novo
      if (file) {
        const storageRef = ref(storage, `statements/${Date.now()}_${file.name}`);
        await uploadBytes(storageRef, file);
        updateData.attachmentUrl = await getDownloadURL(storageRef);
      }

      await updateDoc(doc(db, STATEMENTS_COLLECTION, id), updateData);

      // Atualizar status da meta após modificação
      await this.updateGoalStatus();

      // Obter documento atualizado
      const updatedDoc = await getDoc(doc(db, STATEMENTS_COLLECTION, id));

      return {
        id,
        ...updatedDoc.data(),
        createdAt: (updatedDoc.data()?.createdAt as Timestamp).toDate(),
        updatedAt: new Date()
      } as BankStatement;
    } catch (error) {
      console.error('Erro ao atualizar extrato:', error);
      throw error;
    }
  },

  // Excluir um extrato
  async deleteStatement(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, STATEMENTS_COLLECTION, id));

      // Atualizar status da meta após exclusão
      await this.updateGoalStatus();
    } catch (error) {
      console.error('Erro ao excluir extrato:', error);
      throw error;
    }
  },

  // Atualizar o status da meta com base nos extratos existentes
  async updateGoalStatus(): Promise<void> {
    try {
      // Obter todos os extratos
      const statements = await this.getStatements();

      // Calcular o valor total dos extratos
      const currentAmount = statements.reduce((sum, statement) => sum + statement.amount, 0);

      // Obter o documento de meta atual ou criar um padrão
      let goalDoc;
      try {
        goalDoc = await getDoc(doc(db, GOAL_COLLECTION, GOAL_DOC));
      } catch (error) {
        console.error('Erro ao obter documento de meta:', error);
      }

      let goalAmount = 100000; // Valor padrão da meta

      if (goalDoc && goalDoc.exists()) {
        goalAmount = goalDoc.data().goalAmount || goalAmount;
      }

      // Calcular a porcentagem de conclusão
      const percentage = (currentAmount / goalAmount) * 100;

      // Atualizar o documento de status da meta
      await setDoc(doc(db, GOAL_COLLECTION, GOAL_DOC), {
        currentAmount,
        goalAmount,
        percentage,
        lastUpdate: serverTimestamp()
      });
    } catch (error) {
      console.error('Erro ao atualizar status da meta:', error);
      throw error;
    }
  },

  // Obter o status atual da meta
  async getGoalStatus(): Promise<GoalStatus> {
    try {
      const goalDoc = await getDoc(doc(db, GOAL_COLLECTION, GOAL_DOC));

      if (goalDoc.exists()) {
        const data = goalDoc.data();
        return {
          currentAmount: data.currentAmount || 0,
          goalAmount: data.goalAmount || 100000,
          percentage: data.percentage || 0,
          lastUpdate: data.lastUpdate ? (data.lastUpdate as Timestamp).toDate() : new Date()
        };
      }

      // Se não existir, criar documento padrão e retornar
      const defaultGoal = {
        currentAmount: 0,
        goalAmount: 100000,
        percentage: 0,
        lastUpdate: new Date()
      };

      await setDoc(doc(db, GOAL_COLLECTION, GOAL_DOC), {
        ...defaultGoal,
        lastUpdate: serverTimestamp()
      });

      return defaultGoal;
    } catch (error) {
      console.error('Erro ao obter status da meta:', error);
      throw error;
    }
  },

  // Atualizar valor da meta
  async updateGoalAmount(amount: number): Promise<GoalStatus> {
    try {
      const goalStatus = await this.getGoalStatus();

      // Atualizar apenas o valor da meta e recalcular porcentagem
      const percentage = (goalStatus.currentAmount / amount) * 100;

      await updateDoc(doc(db, GOAL_COLLECTION, GOAL_DOC), {
        goalAmount: amount,
        percentage,
        lastUpdate: serverTimestamp()
      });

      return {
        ...goalStatus,
        goalAmount: amount,
        percentage,
        lastUpdate: new Date()
      };
    } catch (error) {
      console.error('Erro ao atualizar valor da meta:', error);
      throw error;
    }
  }
};
