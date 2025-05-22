import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';

@ApiTags('users')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Crear usuario' })
  @ApiResponse({ status: 201, description: 'Usuario creado' })
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @ApiOperation({ summary: 'Obtener todos los usuarios' })
  @ApiResponse({ status: 200, description: 'Lista de usuarios' })
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @ApiOperation({ summary: 'Obtener usuario por id' })
  @ApiResponse({ status: 200, description: 'Usuario encontrado' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @ApiOperation({ summary: 'Actualizar usuario' })
  @ApiResponse({ status: 200, description: 'Usuario actualizado' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @ApiOperation({ summary: 'Eliminar usuario' })
  @ApiResponse({ status: 200, description: 'Usuario eliminado' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }

  @ApiOperation({ summary: 'Login de usuario' })
  @ApiResponse({ status: 200, description: 'Login exitoso' })
  @Post('auth/login')
  login(@Body() loginUserDto: CreateUserDto) {
    return this.userService.login(loginUserDto);
  }

  @ApiOperation({ summary: 'Registro de usuario' })
  @ApiResponse({ status: 201, description: 'Usuario registrado' })
  @Post('auth/register')
  register(@Body() registerUserDto: CreateUserDto) {
    return this.userService.register(registerUserDto);
  }

  @ApiOperation({ summary: 'Logout de usuario' })
  @ApiResponse({ status: 200, description: 'Logout exitoso' })
  @Get('auth/logout')
  logout() {
    return this.userService.logout();
  }

  @ApiOperation({ summary: 'Perfil de usuario autenticado' })
  @ApiResponse({ status: 200, description: 'Ruta protegida' })
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @Get('profile')
  getProfile() {
    // Solo usuarios autenticados con rol admin pueden acceder
    return { message: 'Ruta protegida: usuario autenticado y admin' };
  }
}
