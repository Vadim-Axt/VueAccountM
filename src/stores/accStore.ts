import { defineStore } from 'pinia';
import { ref, watch } from 'vue';

// Типы оставляем те же
export interface Account {
  id: number;
  labels: string[];
  type: 'local' | 'ldap';
  login: string;
  password: string | null;
}

export const useAccountStore = defineStore('account', () => {
  // --- STATE (Состояние) ---
  const accounts = ref<Account[]>([]);
  const accountType = ref<'local' | 'ldap'>('local');
  const nextId = ref(1);

  // --- ACTIONS (Действия) ---
  // Просто меняем данные, о сохранении не думаем — оно автоматическое
  
  function addAccount(account: Omit<Account, 'id'>) {
    accounts.value.push({ 
      ...account, 
      id: nextId.value++ 
    });
  }

  function updateAccount(id: number, updates: Partial<Omit<Account, 'id'>>) {
    const index = accounts.value.findIndex(acc => acc.id === id);
    if (index !== -1) {
      // Это сработает для любого поля: пароль, логин, метки
      accounts.value[index] = { ...accounts.value[index], ...updates };
    }
  }

  function removeAccount(id: number) {
    accounts.value = accounts.value.filter(acc => acc.id !== id);
  }

  function setAccountType(type: 'local' | 'ldap') {
    accountType.value = type;
  }

  // --- PERSISTENCE (Умное сохранение и загрузка) ---

  // 1. Загрузка при инициализации (срабатывает 1 раз при старте)
  const storedData = localStorage.getItem('my-app-data');
  if (storedData) {
    try {
      const parsed = JSON.parse(storedData);
      accounts.value = parsed.accounts || [];
      accountType.value = parsed.accountType || 'local';
      nextId.value = parsed.nextId || 1;
    } catch (e) {
      console.error('Ошибка чтения localStorage', e);
    }
  }

  // 2. Автоматическое сохранение (WATCH)
  // Следит за любыми изменениями в accounts, accountType или nextId
  watch(
    [accounts, accountType, nextId], 
    (state) => {
      // Сохраняем всё одним куском, чтобы данные были целостными
      localStorage.setItem('my-app-data', JSON.stringify({
        accounts: accounts.value,
        accountType: accountType.value,
        nextId: nextId.value
      }));
    },
    { deep: true } // Важно: deep позволяет следить за изменениями внутри объектов массива
  );

  return {
    accounts,
    accountType,
    nextId,
    addAccount,
    updateAccount,
    removeAccount,
    setAccountType
  };
});