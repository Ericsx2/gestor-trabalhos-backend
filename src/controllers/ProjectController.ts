import { Request, Response } from 'express';
import { prismaClient } from '../database/prismaClient';
import { generate } from 'generate-password';
import { hashSync, genSaltSync } from 'bcrypt';

class ProjectController {
  async index(_: Request, response: Response) {
    const projects = await prismaClient.project.findMany();

    return response.status(200).json(projects);
  }

  async store(request: Request, response: Response) {
    const { title, description, registration_teatcher, matter_name, registration_student } = request.body;


    const titleAlreadyExists = await prismaClient.project.findFirst({
      where: {
        title,
      },
    });

    if (titleAlreadyExists) {
      return response.status(302).send({ message: 'Projeto já existente!' });
    }

    const descriptionAlreadyExists = await prismaClient.project.findFirst({
      where: {
        description,
      },
    });

    if (descriptionAlreadyExists) {
      return response.status(302).send({ message: 'Descrição já existente!' });
    }

    const student = await prismaClient.student.findFirst({
      where: {
        registration: registration_student,
      },
    });

    if(!student){
      return response.status(404).json({ 'message':'Aluno não foi encontrado!'});
    }

    const teatcher = await prismaClient.teacher.findFirst({
      where: {
        registration: registration_teatcher,
      },
    });

    if(!teatcher){
      return response.status(404).json({ 'message':'Professor não foi encontrado!'});
    }

    const matter = await prismaClient.matter.findFirst({
      where: {
        name: matter_name,
      },
    });

    if(!matter){
      return response.status(404).json({ 'message':'Matéria não foi encontrada!'});
    }

    const project = await prismaClient.project.create({
      data: {
        title,
        description,
        studentId: student.id,
        teacherId: teatcher.id,
        matterId: matter.id,
      },
    });

    

    return response.send({ message: 'Projeto criado com sucesso' });
  }

  async show(request: Request, response: Response) {
    const { id } = request.params;
    const project = await prismaClient.project.findFirst({
      where: {
        id,
      },
    });

    if (!project) {
      return response.status(404).send({ message: 'Projeto não encontrado' });
    }

    return response.status(200).json({
      id: project.id,
      title: project.title,
      description: project.description,
    });
  }

  async update(request: Request, response: Response) {
    const { id } = request.params;
    const { title, description, registration_teatcher, matter_name, registration_student } = request.body;


    const titleAlreadyExists = await prismaClient.project.findFirst({
      where: {
        title,
      },
    });

    const descriptionAlreadyExists = await prismaClient.project.findFirst({
      where: {
        description,
      },
    });

    const student = await prismaClient.student.findFirst({
      where: {
        registration: registration_student,
      },
    });

    if(!student){
      return response.status(404).json({ 'message':'Aluno não foi encontrado!'});
    }

    const teatcher = await prismaClient.teacher.findFirst({
      where: {
        registration: registration_teatcher,
      },
    });

    if(!teatcher){
      return response.status(404).json({ 'message':'Professor não foi encontrado!'});
    }

    const matter = await prismaClient.matter.findFirst({
      where: {
        name: matter_name,
      },
    });

    if(!matter){
      return response.status(404).json({ 'message':'Matéria não foi encontrada!'});
    }

    const project = await prismaClient.project.update({
      data: {
        title,
        description,
        studentId: student.id,
        teacherId: teatcher.id,
        matterId: matter.id,
      },
      where: {
        id
      }
    });


    return response.send({ message: 'Projeto alterado com sucesso' });
  }

  async delete(request: Request, response: Response) {
    const { id } = request.params;

    const deletedProject = await prismaClient.project.delete({
      where: {
        id,
      },
    });

    return response.status(200).json({ message: 'Projeto deletado com sucesso' });
  }

  async upload(request: Request, response: Response){
    
  }
}

export { ProjectController };
