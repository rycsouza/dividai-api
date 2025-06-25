import vine, { SimpleMessagesProvider } from '@vinejs/vine'

vine.messagesProvider = new SimpleMessagesProvider({
  // Applicable for all fields
  'required': 'O campo {{ field }} é obrigatório',
  'string': 'O valor de {{ field }} deve ser uma string',
  'email': 'Email inválido',
  'regex': 'Formato inválido para o campo {{ field }}',
  'database.unique': '{{ field }} já cadastrado',
})
