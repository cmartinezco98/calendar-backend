import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { Client } from './entities/client.entity';

const relations = [
  'project'
]

@Injectable()
export class ClientsService {

  constructor(
    @InjectRepository(Client)
    private clientRepository: Repository<Client>
  ) { }

  async create(createDataClient: CreateClientDto): Promise<Client> {
    try {
      const resClientCreate = await this.clientRepository.save(createDataClient);
      return resClientCreate;
    } catch (err) {
      throw new HttpException(`${err.sqlMessage}, Error al crear cliente`, HttpStatus.BAD_REQUEST);
    }
  }

  async findAll(): Promise<Client[]> {
    const resClients = await this.clientRepository.find({ relations, order: { n_name: 'ASC' } });
    return resClients;
  }

  async findOne(k_client: number): Promise<Client> {
    const resClient = await this.clientRepository.findOne({ where: { k_client }, relations });
    if (!resClient) throw new HttpException(`No se encuentra cliente con el ID ${k_client}`, HttpStatus.NOT_FOUND);
    return resClient;
  }

  async update(k_client: number, updateDataClient: UpdateClientDto): Promise<UpdateResult> {
    await this.findOne(k_client);
    try {
      const resClientUpdate = await this.clientRepository.update(k_client, updateDataClient);
      return resClientUpdate;
    } catch (err) {
      throw new HttpException(`${err.sqlMessage}, Error al actualizar cliente`, HttpStatus.BAD_REQUEST);
    }
  }

  async remove(k_client: number) {
    if (isNaN(k_client)) throw new HttpException(`Key no valida, Error al borrar cliente`, HttpStatus.BAD_REQUEST);
    await this.findOne(k_client);
    try {
      const res = {
        message: "Eliminado con exito",
        status: true
      };
      const resDelete = await this.clientRepository.delete(k_client);
      if (resDelete.affected == 0) {
        res.message = "No se encontró el cliente para eliminar"
        res.status = false;
      }
      return res;
    } catch (err) {
      if (err.errno === 1451 || err.code === 'ER_ROW_IS_REFERENCED_2') {
        throw new HttpException(
          'No se puede eliminar el cliente porque tiene proyectos asociados.',
          HttpStatus.CONFLICT
        );
      }

      throw new HttpException(
        `Error al borrar cliente: ${err.sqlMessage || err.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}

