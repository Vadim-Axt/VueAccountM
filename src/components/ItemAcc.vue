<script setup lang="ts">
import { computed, ref, watch} from 'vue';
import type {Account} from "../stores/accStore.ts";

interface Props {
  account: Account;
}
interface Emits {
  (e: 'update:account', value: Partial<Account>): void;
  (e: 'remove'):void;
}


const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const localLabelsText = ref(props.account.labels.join('; '))
const localType = ref(props.account.type);
const localLogin = ref(props.account.login);
const localPassword = ref(props.account.password);



const errors = ref({
  labels: '',
  type: '',
  login: '',
  password: '',
})
const hasErrors = computed(() => {
  return Object.values(errors.value).some(error => error !== '')
})


const parseLabels = (text: string): string[] => {
  return text
      .split(';')
      .map(label => label.trim())
      .filter(label => label.length > 0)
}

const validate = () => {
  let isValid = true;

  if (!localLogin.value.trim()) {
    errors.value.login = 'Логин должен быть!!!'
    isValid = false
  } else if (localLogin.value.length > 100) {
    errors.value.login = 'Логин должен быть не более 100 символов'
    isValid = false
  } else {
    errors.value.login = ''
  }


  if (localType.value === 'local') {
    if (!localPassword.value) {
      errors.value.password = 'Введите пароль'
      isValid = false
    } else if(localPassword.value.length > 100) {
      errors.value.password = 'Пароль должен быть не более 100 символов'
      isValid = false
    } else {
      errors.value.password = ''
    }
  }


  if (localLabelsText.value.length > 50) {
    errors.value.labels = 'Меки должны быть не более 50 символов'
    isValid = false
  } else {
    errors.value.labels = ''
  }
  return isValid;
}

const updateLabels = () => {
  if (validate()) {
    const labels = parseLabels(localLabelsText.value);
    emit('update:account', { labels })
  }
}



const updateType = () => {
  if (validate()) {
    const updates: Partial<Account> = { type: localType.value };
    if (localType.value === "ldap") {
      updates.password = null;
      localPassword.value = '';
    }
    emit('update:account', updates);
  }
}

const updateLogin = () => {
  if (validate()) {
    emit('update:account', { login: localLogin.value });
  }
}
const updatePassword = () => {
  if (validate()) {
    emit('update:account', { password: localPassword.value });
  }
}


watch(() => props.account, (newAccount) => {
  localLabelsText.value = newAccount.labels.join('; ');
  localType.value = newAccount.type;
  localLogin.value = newAccount.login;
  localPassword.value = newAccount.password;
}, { deep: true})



</script>

<template>
  <div class="account-item card mb-3 d-flex align-items-center justify-content-between" :class="{ 'has-error': hasErrors }">
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

        <div class="col-md-3 mb-3 flex-grow-1">
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

        <div class="col-md-1 d-flex align-items-center
         mb-3 flex-row justify-content-between">
          <button
              class="btn btn-danger mx-3"
              @click="$emit('remove')"
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