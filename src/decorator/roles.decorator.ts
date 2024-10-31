import { SetMetadata } from "@nestjs/common";
import { Role } from "src/enums/roles.enum";

export const Roles_key = 'roles';
// SetMetadata es una función de NestJS que asocia datos (en este caso, roles) a una clave (Roles_key).
// Cuando Roles se aplica a un controlador o método, se guardan los roles permitidos en los metadatos de la ruta o clase.
export const Roles = (...roles: Role[]) => SetMetadata(Roles_key, roles);