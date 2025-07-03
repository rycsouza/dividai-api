/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

const UsuariosController = () => import('#controllers/usuarios_controller')
import router from '@adonisjs/core/services/router'

router
  .group(() => {
    router
      .group(() => {
        router.post('registrar', [UsuariosController, 'store'])
        router.post('login', [UsuariosController, 'login'])
      })
      .prefix('usuarios')
  })
  .prefix('v1')
