<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Account } from "../stores/accStore"



interface Props {
  account: Account
}
interface Emits {
  (e: 'update:account', value: Partial<Account>): void
  (e: 'remove'): void
}

const showPassword = ref(false)


const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const errors = ref({
  labels: '',
  login: '',
  password: '',
})

const labelsText = computed({
  get: () => props.account.labels.join('; '),
  set: (val: string) => {
    const labels = val
      .split(';')
      .map(l => l.trim())
      .filter(Boolean)

    if (val.length > 50) {
      errors.value.labels = 'Метки не более 50 символов'
      return
    }

    errors.value.labels = ''
    emit('update:account', { labels })
  }
})

const login = computed({
  get: () => props.account.login,
  set: (val: string) => {
    if (!val.trim()) {
      errors.value.login = 'Введите логин'
      return
    }
    if (val.length > 100) {
      errors.value.login = 'Логин не более 100 символов'
      return
    }

    errors.value.login = ''
    emit('update:account', { login: val })
  }
})

const password = computed({
  get: () => props.account.password || '',
  set: (val: string) => {
    if (props.account.type === 'local') {
      if (!val) {
        errors.value.password = 'Введите пароль'
        return
      }
      if (val.length > 100) {
        errors.value.password = 'Пароль не более 100 символов'
        return
      }
    }

    errors.value.password = ''
    emit('update:account', { password: val })
  }
})

const type = computed({
  get: () => props.account.type,
  set: (val: 'local' | 'ldap') => {
    emit('update:account', { type: val })
  }
})
</script>


<template>
  <div class="account-item card mb-3">
    <div class="card-body">
      <div class="row">

        <div class="col-md-3 mb-3">
          <label class="form-label">Метки</label>
          <input
            class="form-control"
            :class="{ 'is-invalid': errors.labels }"
            v-model="labelsText"
            placeholder="Введите метки через ;"
            maxlength="50"
            
          />
          <div class="invalid-feedback">{{ errors.labels }}</div>
        </div>

        <div class="col-md-2 mb-3">
          <label class="form-label">Тип записи</label>
          <select
            class="form-select"
            v-model="type"
          >
            <option value="local">Локальная</option>
            <option value="ldap">LDAP</option>
          </select>
        </div>

        <div class="col-md-3 mb-3">
          <label class="form-label">Логин</label>
          <input
            class="form-control"
            :class="{ 'is-invalid': errors.login }"
            v-model="login"
            maxlength="100"
          />
          <div class="invalid-feedback">{{ errors.login }}</div>
        </div>

        <div class="col-md-3 mb-3" v-if="type === 'local'">
  <label class="form-label">Пароль</label>

  <div class="input-group">
    <input
      :type="showPassword ? 'text' : 'password'"
      class="form-control"
      :class="{ 'is-invalid': errors.password }"
      v-model="password"
    />
    <button
      class="btn btn-outline-secondary"
      type="button"
      @click="showPassword = !showPassword"
    >
      {{ showPassword ? 'Скрыть' : 'Показать' }}
    </button>
  </div>

  <div class="invalid-feedback">{{ errors.password }}</div>
</div>


        <div class="col-md-1 d-flex align-items-center">
          <button class="btn btn-danger" @click="$emit('remove')">×</button>
        </div>

      </div>
    </div>
  </div>
</template>


<style scoped>
.account-item {
  transition: border-color 0.3s;
}
.account-item.has-error {
  border-color: #dc3545;
}
</style>