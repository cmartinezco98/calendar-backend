import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { hash } from 'bcrypt';
import { DeleteResult, In, Repository } from 'typeorm';
import { Role } from '../roles/entities/role.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

const relations = [
  'project',
  'taskCreator',
  'taskResponsible',
  'role'
];

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) { }

  async create(createDataUser: CreateUserDto) {
    const emailExist = await this.userRepository.findOne({ where: { n_email: createDataUser.n_email }, relations });
    if (emailExist) {
      if (!emailExist.i_active) {
        throw new HttpException('El usuario se encuentra desactivado', HttpStatus.BAD_REQUEST);
      }

      throw new HttpException('Usuario existente', HttpStatus.BAD_REQUEST);
    }
    try {
      createDataUser.n_password = await hash(createDataUser.n_password, 10);

      const resCreateUser = await this.userRepository.create(createDataUser);
      const roles = await this.roleRepository.find({ where: { k_role: In(createDataUser.n_rol) } });
      const user: User = {
        ...resCreateUser,
        role: roles
      }

      return await this.userRepository.save(user);
    } catch (err) {
      throw new HttpException(`${err.sqlMessage}, Error al crear el usuario`, HttpStatus.BAD_REQUEST);
    }
  }

  async findOneByEmail(email: string): Promise<User> {
    return await this.userRepository.findOne({ where: { n_email: email, i_active: true }, relations });
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find({ where: { i_active: true }, relations });
  }

  async findAllWithOutRelations(): Promise<User[]> {
    const response = await this.userRepository.find({ where: { i_active: true }, relations: ['role'] });

    if (response) return response;
    throw new NotFoundException(`No se encuentron usuarios.`);
  }

  async findOne(k_user: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { k_user, i_active: true },
      relations,
    });
    if (!user) throw new HttpException(`No se encuentra el usuario con el ID: ${k_user}, Error de busqueda`, HttpStatus.NOT_FOUND);
    return user;
  }

  async update(k_user: number, data: UpdateUserDto): Promise<User> {
    //Destructuracion de objeto UpdateUserDto
    const { n_email, n_last_name, n_name, n_rol, i_active, n_password }: UpdateUserDto = data;

    //Busqueda de Entidad User por ID 
    const resUser: User = await this.userRepository.findOne({ where: { k_user } });
    if (!resUser) throw new HttpException(`No se fue posible actualizar el usuario: ${k_user}, Error de actualización`, HttpStatus.CONFLICT);

    //Busqueda de Entidad Role[] por ID 
    let role: Role[] = [];

    if (n_rol) {
      role = await this.roleRepository.find({ where: { k_role: In(n_rol) } });
      if (role.length == 0) throw new HttpException(`No se fue posible actualizar el rol es incorrecto, Error de actualización`, HttpStatus.CONFLICT);
    }


    //Actualizamos los valores de la Entidad User
    resUser.n_name = n_name ?? resUser.n_name;
    resUser.n_last_name = n_last_name ?? resUser.n_last_name;
    resUser.n_email = n_email ?? resUser.n_email;
    resUser.i_active = i_active ?? resUser.i_active;

    if (n_password) resUser.n_password = await hash(n_password, 10);

    //Construimos nuevo objeto el cual se utilizara para actualizar tabla Muchos a Muchos
    const user: User = {
      ...resUser,
      role
    }

    //El metodo save actualizara la Entidad User y su tabla pivote user_role
    const resUpdateRole = await this.userRepository.save(user);
    if (!resUpdateRole) throw new HttpException(`No se fue posible actualizar el role del usuario: ${k_user}, Error de actualización`, HttpStatus.CONFLICT);

    return resUpdateRole;
  }

  async remove(k_user: number): Promise<DeleteResult> {
    await this.findOne(k_user);
    try {
      const res = await this.userRepository.delete(k_user);
      return res;
    } catch (err) {
      throw new HttpException(`${err.sqlMessage}, Error al eliminar`, HttpStatus.BAD_REQUEST);
    }
  }
}
