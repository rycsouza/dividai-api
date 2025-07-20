import mail from '@adonisjs/mail/services/main'

interface ConvidarMembroData {
  usuario: { nome: string }
  convidado: {
    email: string
  }
  grupo: { nome: string }
}

export default {
  key: 'ConvidarMembro',
  async handle({ data }: { data: ConvidarMembroData }) {
    const { usuario, convidado, grupo } = data

    await mail.send((message) => {
      message
        .to(convidado.email)
        .from('no-reply@dividai.com.br', 'Divida AI')
        .subject(`Convite para grupo`)
        .text(`${usuario.nome} te convidou para participar do grupo ${grupo.nome}...`)
    })
  },
}
