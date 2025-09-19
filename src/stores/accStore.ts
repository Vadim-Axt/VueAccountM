import { defineStore } from 'pinia';

export interface Account {
    id: number;
    labels: string[];
    type: 'local' | 'ldap';
    login: string;
    password: string | null;
}

interface AccountState {
    accounts: Account[];
    nextId: number;
}

export const useAccountStore = defineStore('account', {
    state: (): AccountState => ({
        accounts: [],
        nextId: 1,
    }),
    actions: {
        addAccount(account: Omit<Account, 'id'>) {
            this.accounts.push({ ...account, id: this.nextId++ });
            this.saveToLocalStorage();
        },
        updateAccount(id: number, updates: Partial<Omit<Account, 'id'>>) {
            const index = this.accounts.findIndex(acc => acc.id === id);
            if (index === -1) return;

            this.accounts[index] = { ...this.accounts[index], ...updates } as Account;

            this.saveToLocalStorage();
        },
        removeAccount(id: number) {
            this.accounts = this.accounts.filter(acc => acc.id !== id);
            this.saveToLocalStorage();
        },
        saveToLocalStorage() {
            localStorage.setItem('accounts', JSON.stringify(this.accounts));
            localStorage.setItem('nextId', this.nextId.toString());
        },
        loadFromLocalStorage() {
            const accounts = localStorage.getItem('accounts');
            const nextId = localStorage.getItem('nextId');

            if (accounts) {
                this.accounts = JSON.parse(accounts);
            }
            if (nextId) {
                this.nextId = parseInt(nextId, 10);
            }
        },
    },
});