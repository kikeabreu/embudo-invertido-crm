# Activar operación por cliente en Supabase

Haz esto una sola vez después de que el código esté en GitHub.

1. Entra a [Supabase](https://supabase.com/dashboard) y abre el proyecto de este CRM.
2. En el menú izquierdo abre **SQL Editor**.
3. Pulsa **New query**.
4. Abre el archivo `operacion_clientes_schema.sql` de este proyecto.
5. Copia todo su contenido y pégalo en la consulta de Supabase.
6. Pulsa **Run**. Debe aparecer `Success. No rows returned`.
7. Cierra sesión en el CRM y vuelve a entrar para refrescar los permisos.
8. En el panel principal, busca **Asignación de editores** y marca los clientes de cada editor.
9. Abre cada cliente, entra a **Admin** y configura:
   - **Fecha de contratación**: día en que inicia su ciclo mensual.
   - **Piezas comprometidas por ciclo**: por ejemplo, 12.
   - **Próxima acción operativa**: el siguiente cierre concreto.
   - **Notas operativas internas**: contexto que el cliente no necesita ver.

## Si no puedes crear clientes desde el CRM

El alta de usuarios necesita una llave privada de Supabase. No la pegues en GitHub ni en ningún archivo público.

1. En Supabase abre **Project Settings**.
2. Entra a **API Keys**.
3. Copia la llave secreta `service_role`.
4. En tu archivo local `.env.local` agrega una línea llamada `SUPABASE_SERVICE_ROLE_KEY` con esa llave.
5. Si el sitio está conectado a Vercel, abre el proyecto en Vercel y entra a **Settings → Environment Variables**.
6. Crea `SUPABASE_SERVICE_ROLE_KEY`, pega la llave y selecciónala para Production, Preview y Development.
7. Haz un nuevo despliegue en Vercel. La llave nunca debe comenzar con `NEXT_PUBLIC_`.

## Cómo funciona el cierre mensual

Si un cliente inició el 18 de agosto, su ciclo vigente va del 18 de agosto al 17 de septiembre. Otro cliente que inició el día 3 tendrá un ciclo del 3 del mes al 2 del siguiente. El panel calcula ambos de forma independiente.

Las piezas cambian automáticamente su `fecha_publicada` cuando pasan al estado **Publicado**. El avance del ciclo compara publicaciones reales contra la meta comprometida y muestra **Al día**, **En curso**, **Atención** o **Crítico**.

## Permisos resultantes

- **Admin**: ve todos los clientes, configura ciclos, asigna editores y consulta Editor Analytics.
- **Editor / Equipo**: sólo ve clientes asignados y puede operar sus piezas, proyectos y tareas. No ve Editor Analytics ni Admin.
- **Cliente / Broker**: entra directamente a su cuenta, consulta su ciclo y mantiene el flujo de comentarios y aprobación.
- **Coordinador**: consulta la cuenta del cliente al que está vinculado.
