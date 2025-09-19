<script setup lang="ts">
import { computed, ref, watch} from 'vue';
import type {Account} from "../stores/accStore.ts";

interface Props {
  acount: Account;
}
interface Emits {
  (e: 'update:account', value: Partial<Account>): void;
  (e: 'remove'):void;
}


const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const errors = ref({
  labels: '',
  type: '',
  login: '',
  password: '',
})
const hasErrors = computed(() => {
  return Object.values(errors.value).some(error => error !== '')
})

</script>

<template>
  <div class="account-item card mb-3" :class="{ 'has-error': hasErrors }">
    <div class="card-body">
      <div class="row">
        <div class="col-md-3 mb-3">
          <label class="form-label">Метки</label>
          <input
              type="text"
              class="form-control"
              :class="{ 'is-invalid': errors.labels }"
              v-model="localLabelsText"
              @blur="updateLabels"
              placeholder="Введите метки через ;"
              maxlength="50"
          />
          <div class="form-text">Метки через точку с запятой (;)</div>
          <div class="invalid-feedback" v-if="errors.labels">
            {{ errors.labels }}
          </div>
        </div>

        <div class="col-md-2 mb-3">
          <label class="form-label">Тип записи</label>
          <select
              class="form-select"
              :class="{ 'is-invalid': errors.type }"
              v-model="localType"
              @change="updateType"
          >
            <option value="local">Локальная</option>
            <option value="ldap">LDAP</option>
          </select>
          <div class="invalid-feedback" v-if="errors.type">
            {{ errors.type }}
          </div>
        </div>

        <div class="col-md-3 mb-3">
          <label class="form-label">Логин</label>
          <input
              type="text"
              class="form-control"
              :class="{ 'is-invalid': errors.login }"
              v-model="localLogin"
              @blur="updateLogin"
              placeholder="Введите логин"
              maxlength="100"
          />
          <div class="invalid-feedback" v-if="errors.login">
            {{ errors.login }}
          </div>
        </div>

        <div class="col-md-3 mb-3" v-if="localType === 'local'">
          <label class="form-label">Пароль</label>
          <input
              type="password"
              class="form-control"
              :class="{ 'is-invalid': errors.password }"
              v-model="localPassword"
              @blur="updatePassword"
              placeholder="Введите пароль"
              maxlength="100"
          />
          <div class="invalid-feedback" v-if="errors.password">
            {{ errors.password }}
          </div>
        </div>

        <div class="col-md-1 d-flex align-items-end mb-3">
          <button
              class="btn btn-danger"
              @click="$emit('remove')"
              title="Удалить учетную запись"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>