import { HttpContext } from '@adonisjs/core/http'

interface CalcularDivisao {
  valor: number
  tipoDivisao?: 'igualmente' | 'especifica'
  participantes: Array<{ id: number; porcentagem?: number; valor?: number }>
  tipoCalculoParaDivisaoEspecifica?: 'porcentagem' | 'valor'
  response?: HttpContext['response']
}

const calculos = {
  igualmente: ({ valor, participantes }: CalcularDivisao) => {
    const valorPorParticipante = valor / participantes.length
    return participantes.map((participante) => ({
      ...participante,
      valor: valorPorParticipante,
    }))
  },
  especifica: ({ valor, participantes, tipoCalculoParaDivisaoEspecifica }: CalcularDivisao) => {
    return participantes.map((participante) => ({
      ...participante,
      valor:
        tipoCalculoParaDivisaoEspecifica === 'porcentagem'
          ? valor * ((participante.porcentagem ?? 100 / participantes.length) / 100)
          : participante.valor!,
    }))
  },
}

function CalcularDivisao({
  valor,
  tipoDivisao = 'igualmente',
  participantes,
  tipoCalculoParaDivisaoEspecifica,
  response,
}: CalcularDivisao) {
  if (tipoDivisao === 'igualmente') return calculos['igualmente']({ valor, participantes })

  const valorTotal = participantes.reduce((acc, participante) => acc + (participante.valor ?? 0), 0)
  if (tipoCalculoParaDivisaoEspecifica === 'valor' && valorTotal !== valor)
    return response?.badRequest(
      'Valor total dividido entre os participantes não corresponde ao valor da despesa'
    )

  return calculos['especifica']({ valor, participantes, tipoCalculoParaDivisaoEspecifica })
}

export default CalcularDivisao
