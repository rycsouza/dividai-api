import { CalcularDivisao } from '#helpers/despesa/index'
import Despesa from '#models/despesa'
import UsuarioDespesa from '#models/usuario_despesa'

import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'
import { DateTime } from 'luxon'
import { criarDespesaValidator } from '#validators/despesa'

export default class DespesasController {
  async store({ request, response, auth }: HttpContext) {
    try {
      const {
        grupo,
        valor,
        tipoDivisao,
        descricao,
        pagadorId,
        data,
        participantes,
        categoria,
        tipoCalculoParaDivisaoEspecifica,
      } = await request.validateUsing(criarDespesaValidator)

      if (tipoDivisao == 'especifica' && !tipoCalculoParaDivisaoEspecifica)
        return response.badRequest({
          mensagem:
            'Para divisão específica, o tipo de cálculo deve ser informado. (valor ou porcentagem)',
        })

      if (valor <= 0)
        return response.badRequest({
          mensagem: 'O valor da despesa deve ser maior que zero.',
        })

      const resultado = CalcularDivisao({
        valor,
        tipoDivisao: tipoDivisao as 'igualmente' | 'especifica',
        participantes,
        tipoCalculoParaDivisaoEspecifica: tipoCalculoParaDivisaoEspecifica as
          | 'valor'
          | 'porcentagem'
          | undefined,
        response,
      })

      return await db.transaction(async (trx) => {
        const valorConvertidoParaCentavos = valor * 100
        const [dia, mes, ano] = data.split('/').map(Number)

        const despesa = await Despesa.create(
          {
            grupo_id: grupo.id,
            valor_total: valorConvertidoParaCentavos,
            ref_data: DateTime.local(ano, mes, dia),
            descricao,
            tipo_divisao: tipoDivisao,
            categoria,
            pagador_id: pagadorId ?? auth.user?.id,
          },
          { client: trx }
        )

        const participantesFormatados = resultado?.map((participante) => ({
          usuario_id: participante.id,
          despesa_id: despesa.id,
          valor: participante.valor * 100,
        }))
        if (!participantesFormatados?.length)
          return response.badRequest('Não é possível criar uma despesa sem participantes.')

        await UsuarioDespesa.createMany(participantesFormatados, { client: trx })

        return response.created({
          mensagem: `Despesa criada com sucesso!`,
          resumo: resultado,
        })
      })
    } catch (error) {
      throw error
    }
  }

  async index({ request, response, auth }: HttpContext) {
    try {
      const { grupo } = request.all()

      const despesas = await Despesa.query()
        .innerJoin('usuario_despesa', 'usuario_despesa.despesa_id', 'despesa.id')
        .where({
          'despesa.grupo_id': grupo.id,
          'usuario_despesa.usuario_id': auth.user?.id,
        })
        .select([
          'despesa.id',
          'despesa.valor_total as valor',
          'despesa.descricao',
          'despesa.ref_data as data',
        ])

      return response.ok({
        mensagem: 'Despesas encontradas com sucesso.',
        despesas: despesas.map((despesa) => {
          return {
            ...despesa.toJSON(),
            ...despesa.$extras,
          }
        }),
      })
    } catch (error) {
      throw error
    }
  }

  async delete({ request, response, auth }: HttpContext) {
    try {
      const { id } = request.params()
      if (!id) return response.badRequest({ mensagem: 'Identificador da despesa é obrigatório.' })

      return await db.transaction(async (trx) => {
        const despesa = await Despesa.findBy(
          {
            id,
            pagador_id: auth.user?.id,
          },
          { client: trx }
        )
        if (!despesa)
          return response.notFound({ mensagem: 'Apenas o pagador da despesa pode deletá-la.' })

        await UsuarioDespesa.query({ client: trx }).where({ despesa_id: despesa.id }).delete()

        await despesa.delete()
        return response.ok({ mensagem: 'Despesa removida com sucesso.' })
      })
    } catch (error) {
      throw error
    }
  }
}
