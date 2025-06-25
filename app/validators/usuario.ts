import vine from '@vinejs/vine'

export const criarUsuarioValidator = vine.compile(
  vine.object({
    nome: vine
      .string()
      .trim()
      .regex(/^[A-Za-zÀ-ÖØ-öø-ÿ]+(?:\s+[A-Za-zÀ-ÖØ-öø-ÿ]+)+$/)
      .maxLength(250),
    email: vine
      .string()
      .trim()
      .email()
      .unique({ table: 'usuario', column: 'email' })
      .maxLength(250),
    telefone: vine
      .string()
      .trim()
      .regex(/^\d{10,11}$/)
      .unique({ table: 'usuario', column: 'telefone' })
      .maxLength(11),
    username: vine.string().trim().unique({ table: 'usuario', column: 'username' }).maxLength(20),
    senha: vine.string(),
    avatar: vine.string().activeUrl().optional(),
  })
)
