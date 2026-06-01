[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/gwV5bmdm)
# seller

Aplicación **Seller** del [Proyecto IAW 2026](https://iaw-2026.github.io/proyecto/) — comisión CoreHardware.

Esta app corresponde al rol del vendedor en los proyectos de tipo **B (Delivery)** y **C (Marketplace)**.

---

**Dependencias**:

- **Framework**: Next.js
- **Autenticación**: Clerk
- **Estilos**: Tailwind
- **ORM**: Prisma

---

Enunciado completo: <https://iaw-2026.github.io/proyecto/>


**1. Dominio de deploy**:https://proyecto-c-seller2-corehardware.vercel.app/

**2. Usuarios**:
- admin: admin+clerktest@iaw.com
- usuario seller con seller creado 1: seller_created_1+clerktest@iaw.com
- usuario seller con seller creado 2: seller_created_2+clerk_test@iaw.com 
- usuario seller sin seller creado: seller_not_created+clerk_test@iaw.com
- Contraseña de todos los usuarios: iawuser#

**3. Instrucciones**: Usar el usuario seller con seller creado 1 para testear las funcionalidades normales de seller, usuario seller con seller creado 2 está para testear la funcionalidad de borrar cuenta, que elimina el seller , todos sus productos y ventas y el usuario de clerk. El usuario seller sin seller creado es para testear la creación de usuario, que no funciona automáticamente en este deploy.

**4. Descripción del proyecto**: El administrador puede crear, modificar y eliminar productos (puede filtrar por vendedor accediendo desde el panel del vendedor o usando parámetros de búsqueda), ver los detalles de los vendedores y generar un reporte de ventas. 
El vendedor puede publicar productos y ver sus productos, puede aumentar stock y cambiar el precio, descripción o imagen de un producto, puede generar un reporte de sus ventas y borrar su usuario. 

**5. Notas**: El Webhook de Clerk que asigna automáticamente el rol de seller a un usuario no se puede testear porque Clerk no acepta dominios de Vercel. Funcionalidades que pienso implementar para la próxima etapa: [documentation\FeaturesToImplement.md](documentation\FeaturesToImplement.md)
