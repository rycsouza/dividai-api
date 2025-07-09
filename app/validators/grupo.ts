import vine from '@vinejs/vine'

export const criarGrupo = vine.compile(
  vine.object({
    nome: vine.string().maxLength(250).minLength(1).trim(),
    imagem: vine.string().activeUrl().optional(),
    participantes: vine.array(vine.number()).optional(),
  })
)

export const atualizarGrupo = vine.compile(
  vine.object({
    nome: vine.string().maxLength(250).minLength(1).trim().optional(),
    imagem: vine.string().activeUrl().optional(),
    grupo: vine.object({
      id: vine.number(),
      nome: vine.string(),
      imagem: vine.string().activeUrl().optional(),
    }),
  })
)

export const deletarGrupo = vine.compile(
  vine.object({
    id: vine.number(),
    grupo: vine.object({
      id: vine.number(),
      nome: vine.string(),
      imagem: vine.string().activeUrl().optional(),
    }),
  })
)

export const addMembro = vine.compile(
  vine.object({
    id: vine.number(),
    usuarioId: vine.number(),
    grupo: vine.object({
      id: vine.number(),
      nome: vine.string(),
      imagem: vine.string().activeUrl().optional(),
    }),
  })
)

export const convidarMembro = vine.compile(
  vine.object({
    id: vine.number(),
    email: vine.string().email(),
    grupo: vine.object({
      id: vine.number(),
      nome: vine.string(),
      imagem: vine.string().activeUrl().optional(),
    }),
  })
)

export const listarMembros = vine.compile(
  vine.object({
    id: vine.number(),
    grupo: vine.object({
      id: vine.number(),
      nome: vine.string(),
      imagem: vine.string().activeUrl().optional(),
    }),
  })
)

export const removerMembro = vine.compile(
  vine.object({
    id: vine.number(),
    usuarioId: vine.number(),
    grupo: vine.object({
      id: vine.number(),
      nome: vine.string(),
      imagem: vine.string().activeUrl().optional(),
    }),
  })
)
