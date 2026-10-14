<script setup lang="ts">
import { watch } from 'vue'
import { useForm } from 'vee-validate'
import * as yup from 'yup'
import type { Transaction, TransactionType } from '@/types/index'

const props = defineProps<{
  initialData?: Transaction | null
}>()

const emit = defineEmits<{
  (e: 'add-transaction', transaction: { type: TransactionType; amount: number; category: string; date: string; note: string | null }): void
  (e: 'cancel'): void
}>()


const schema = yup.object({
  type: yup.string().oneOf(['Expense', 'Income']).required(),
  amount: yup.number().typeError('Fill Amount').required('ငွေပမာဏ ထည့်ရန် လိုအပ်ပါသည်။').positive('ငွေပမာဏသည် 0 ထက်ကြီးရပါမည်။'),
  category: yup.string().required('Please Fill Category'),
  date: yup.string().required(),
  note: yup.string().nullable()
})


const { handleSubmit, defineField, resetForm, errors } = useForm({
  validationSchema: schema,
  initialValues: {
    type: props.initialData?.type || 'Expense',
    amount: props.initialData?.amount ?? (''),
    category: props.initialData?.category || '',
    date: props.initialData?.date || new Date().toISOString().split('T')[0],
    note: props.initialData?.note || ''
  }
})


const [type] = defineField('type')
const [amount] = defineField('amount')
const [category] = defineField('category')
const [date] = defineField('date')
const [note] = defineField('note')


watch(() => props.initialData, (newVal) => {
  if (newVal) {
    resetForm({
      values: {
        type: newVal.type,
        amount: newVal.amount,
        category: newVal.category,
        date: newVal.date,
        note: newVal.note || ''
      }
    })
  } else {
    resetForm({
      values: {
        type: 'Expense',
        amount: '',
        category: '',
        date: new Date().toISOString().split('T')[0],
        note: ''
      }
    })
  }
})


const onSubmit = handleSubmit((values) => {
  emit('add-transaction', {
    type: values.type as TransactionType,
    amount: Number(values.amount),
    category: values.category,
    date: String(values.date),
    note: values.note && values.note.trim() ? values.note : null
  })
})
</script>

<template>
  <div class="space-y-4">
    
    <div v-if="Object.keys(errors).length > 0" class="p-3 bg-rose-50 text-rose-600 rounded-2xl text-sm font-medium">
      {{ errors.amount || errors.category || 'Please fill Information' }}
    </div>

    <form @submit.prevent="onSubmit" class="space-y-4">
      <div class="grid grid-cols-2 gap-2 bg-pink-50 p-1.5 rounded-2xl">
        <button type="button" @click="type = 'Expense'" :class="type === 'Expense' ? 'bg-white shadow-md font-bold text-rose-600' : 'text-pink-700/60 hover:text-pink-900 font-semibold'" class="py-2.5 rounded-xl text-xs transition-all">Expenses</button>
        <button type="button" @click="type = 'Income'" :class="type === 'Income' ? 'bg-white shadow-md font-bold text-emerald-600' : 'text-pink-700/60 hover:text-pink-900 font-semibold'" class="py-2.5 rounded-xl text-xs transition-all">Income</button>
      </div>

      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-xs font-bold text-pink-800/60 uppercase tracking-wider mb-1.5">Amount *</label>
          <input v-model.number="amount" type="number" placeholder="0.00" class="w-full px-4 py-3 bg-pink-50/50 border border-pink-200 rounded-2xl text-sm font-semibold outline-none focus:border-pink-600 focus:bg-white transition-all" />
        </div>
        <div>
          <label class="block text-xs font-bold text-pink-800/60 uppercase tracking-wider mb-1.5">Date *</label>
          <input v-model="date" type="date" class="w-full px-4 py-3 bg-pink-50/50 border border-pink-200 rounded-2xl text-sm font-semibold outline-none focus:border-pink-600 focus:bg-white transition-all cursor-pointer" />
        </div>
      </div>

      <div>
        <label class="block text-xs font-bold text-pink-800/60 uppercase tracking-wider mb-1.5">Category *</label>
        <select v-model="category" class="w-full px-4 py-3 bg-pink-50/50 border border-pink-200 rounded-2xl text-sm font-semibold outline-none focus:border-pink-600 focus:bg-white transition-all cursor-pointer">
          <option value="" disabled>Select a category</option>
          <option value="Food">Food</option>
          <option value="Investment">Investment</option>
          <option value="Freelance">Freelance</option>
          <option value="Transport">Transport</option>
          <option value="Shopping">Shopping</option>
          <option value="Bills">Bills</option>
          <option value="Entertainment">Entertainment</option>
          <option value="Health">Health</option>
          <option value="Education">Education</option>
          <option value="Salary">Salary</option>
          <option value="Groceries">Groceries</option>
          <option value="Utilities">Utilities</option>
          <option value="Others">Others</option>
        </select>
      </div>

      <div>
        <label class="block text-xs font-bold text-pink-800/60 uppercase tracking-wider mb-1.5">Note (optional)</label>
        <input v-model="note" type="text" placeholder="What was this for?" class="w-full px-4 py-3 bg-pink-50/50 border border-pink-200 rounded-2xl text-sm font-medium outline-none focus:border-pink-600 focus:bg-white transition-all" />
      </div>

      <div class="flex justify-end gap-3 pt-2">
        <button type="button" @click="$emit('cancel')" class="px-6 py-3 bg-pink-50 hover:bg-pink-100 text-pink-900 rounded-2xl text-sm font-bold transition">Cancel</button>
        <button type="submit" class="px-6 py-3 bg-pink-600 hover:bg-pink-700 text-white rounded-2xl text-sm font-bold transition shadow-lg shadow-pink-600/30">Save</button>
      </div>
    </form>
  </div>
</template>