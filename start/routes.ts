import { middleware } from './kernel.js'
/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'

const UsuariosController = () => import('#controllers/usuarios_controller')
const GruposController = () => import('#controllers/grupos_controller')

router.group(() => {
  router
    .group(() => {
      router.post('registrar', [UsuariosController, 'store'])
      router.post('login', [UsuariosController, 'login'])
    })
    .prefix('usuarios')

  router
    .group(() => {
      router.post('/', [GruposController, 'store'])
      router.get('/', [GruposController, 'index'])

      router
        .group(() => {
          router.put('/:id', [GruposController, 'update'])
          router.delete('/:id', [GruposController, 'delete'])

          router.post('/:id/membros', [GruposController, 'addMembro'])
          router.get('/:id/membros', [GruposController, 'indexMembros'])
          router.delete('/:id/membros', [GruposController, 'deleteMembro'])
          router.post('/:id/membros/convites', [GruposController, 'convidarMembro'])
        })
        .middleware([middleware.permission()])
    })
    .prefix('grupos')
    .middleware([middleware.auth()])
})
