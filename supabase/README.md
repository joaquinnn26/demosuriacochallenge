# Configuracion de Supabase

1. Crear un proyecto en Supabase.
2. Ir a SQL Editor y ejecutar `supabase/schema.sql`.
3. Crear el usuario del dueño en Authentication > Users.
4. Copiar `.env.example` a `.env.local` y completar:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
SUPABASE_ADMIN_EMAILS=dueno@suriacochallenge.com
ADMIN_SESSION_SECRET=
ADMIN_SESSION_MINUTES=120
NEXT_PUBLIC_ADMIN_SESSION_MINUTES=120
NEXT_PUBLIC_ADMIN_IDLE_MINUTES=30
NEXT_PUBLIC_ADMIN_MAX_LOGIN_ATTEMPTS=5
NEXT_PUBLIC_ADMIN_LOGIN_LOCK_MINUTES=15
```

5. Reiniciar Next.
6. Entrar a `/admin/actividades` e iniciar sesion con el usuario creado.
7. Si la tabla esta vacia, usar el boton `Importar agenda inicial`.

Si la tabla ya existia antes de estos cambios, volver a ejecutar `supabase/schema.sql`.
El script agrega sin borrar datos las columnas nuevas para Google Maps, latitud,
longitud, fecha calendario, metricas numericas y galeria de imagenes.

La subida de imagenes usa Supabase Storage con el bucket publico
`activity-images`. La API admin lo crea automaticamente en la primera subida si
existe `SUPABASE_SERVICE_ROLE_KEY`.

## Seguridad configurada en la app

- El panel usa Supabase Auth con email/password.
- La API admin exige `Authorization: Bearer <access_token>`.
- La API admin exige ademas una cookie `HttpOnly` firmada por el servidor.
- La cookie admin vence por `ADMIN_SESSION_MINUTES`.
- El panel cierra sesion por inactividad con `NEXT_PUBLIC_ADMIN_IDLE_MINUTES`.
- Los intentos fallidos de login se bloquean temporalmente desde el cliente.
- `SUPABASE_ADMIN_EMAILS` limita que emails pueden administrar.

## Recomendaciones en el dashboard de Supabase

- Desactivar registro publico en Authentication > Sign In / Providers > Email.
- Usar una contraseña fuerte para el usuario dueño.
- Revisar el JWT expiry en Authentication > Settings si queres sesiones mas cortas.
- Activar MFA para el usuario administrador si el plan/proyecto lo permite.

Notas:

- La web publica lee solo actividades con estado `published`.
- El panel lee y guarda usando la API interna `/api/activities`.
- El mapa del home usa las columnas `latitude` y `longitude`; el panel intenta
  leerlas automaticamente desde links de Google Maps con coordenadas.
- Al eliminar una actividad desde admin, tambien se borra de Supabase y deja de
  aparecer en el mapa publico al recargar el home.
- La clave `SUPABASE_SERVICE_ROLE_KEY` queda solo del lado servidor.
- `ADMIN_SESSION_SECRET` debe ser una cadena larga y aleatoria.
