<script setup lang="ts">

import ItemAcc from "./ItemAcc.vue";
import {type Account, useAccountStore} from "../stores/accStore.ts";
import {storeToRefs} from "pinia";
import {onMounted} from "vue";


const accountStore = useAccountStore();
const { accounts } = storeToRefs(accountStore)

onMounted(() => {
  accountStore.loadFromLocalStorage()
})

const addAccount = () => {
  const newAccount: Omit<Account, 'id'> = {
    labels: [],
    type: "local",
    login: '',
    password: '',
  }
  accountStore.addAccount(newAccount)
}

const updateAccount = (id: number, updates: Partial<Account>) => {
  accountStore.updateAccount(id, updates)
}
const removeAccount = (id: number) => {
  accountStore.removeAccount(id)
}

</script>

<template>
  <div class="container mt-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h1>Учетные записи</h1>
      <button class="btn btn-primary" @click="addAccount">
        + Добавить учетную запись
      </button>
    </div>

    <div class="mb-4">
      <h5>Подсказка для поля "Метки":</h5>
      <p class="text-muted">
        Введите текстовые метки, разделенные точкой с запятой (;).
        Например: "Рабочая; Админская; Тестовая". Максимум 50 символов.
      </p>
    </div>

    <div v-if="accounts.length === 0" class="alert alert-info">
      Нет добавленных учетных записей. Нажмите "+ Добавить учетную запись", чтобы создать первую.
    </div>

    <div v-else>
      <div class="row mb-3 fw-bold">
        <div class="col-md-3">Метки</div>
        <div class="col-md-2">Тип записи</div>
        <div class="col-md-3">Логин</div>
        <div class="col-md-3">Пароль</div>
        <div class="col-md-1">Действия</div>
      </div>

      <item-acc
          v-for="account in accounts"
          :key="account.id"
          :account="account"
          @update:account="updateAccount(account.id, $event)"
          @remove="removeAccount(account.id)"
      />
    </div>
  </div>
</template>

<style scoped>

</style>