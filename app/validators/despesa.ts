import vine from '@vinejs/vine'

export const criarDespesaValidator = vine.compile(
  vine.object({
    grupo: vine.object({
      id: vine.number(),
    }),
    valor: vine.number(),
    tipoDivisao: vine.string().in(['especifica', 'igualmente']),
    descricao: vine.string().trim(),
    pagadorId: vine.number().optional(),
    data: vine.string().trim(),
    participantes: vine.array(
      vine.object({
        id: vine.number(),
        valor: vine.number().optional(),
        porcentagem: vine.number().optional(),
      })
    ),
    categoria: vine.string().trim(),
    tipoCalculoParaDivisaoEspecifica: vine.string().trim().in(['valor', 'porcentagem']).optional(),
  })
)
