# Suriaco Challenge

Sitio Next.js con agenda administrable sin Supabase. La web siempre conserva una copia local de la agenda; el panel guarda los cambios y las imágenes en GitHub, cuyo commit activa el despliegue automático del hosting.

## Configuración gratuita

1. Copiar `.env.example` a `.env.local`.
2. Generar la contraseña con `npm run admin:hash -- "una contraseña segura"` y copiar el resultado completo (`scrypt:...:...`) en `ADMIN_PASSWORD_HASH`.
3. Crear un token fine-grained en GitHub limitado al repositorio, con permiso **Contents: Read and write**, y guardarlo como `GITHUB_CONTENTS_TOKEN`.
4. Crear un valor largo y aleatorio para `ADMIN_SESSION_SECRET`.
5. Configurar las mismas variables en el hosting y volver a desplegar.

El token nunca se envía al navegador. Si GitHub no responde, la web pública usa `data/admin-activities.json` o la agenda inicial incorporada y permanece disponible.

## Comandos

- `npm run dev`: desarrollo local.
- `npm run build`: compilación de producción.
- `npm run typecheck`: validación TypeScript.
- `npm run admin:hash -- "contraseña"`: genera el hash seguro para el panel.
