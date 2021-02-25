
import { Request, Response } from 'express'
import { getRepository } from 'typeorm'
import Orphanage  from '../models/Orphanage'
import orphanageView from '../views/orphanages_view'
import * as Yup from 'yup'

export default {

    async index(request: Request, response: Response){
        const getOrphanagesRepository = getRepository(Orphanage)
        const orphanages = await getOrphanagesRepository.find({
            relations: ['images']
        })

        response.status(200).json(orphanageView.renderMany(orphanages))
    },

    async show(request: Request, response: Response){

        const { id } = request.params

        const getOrphanagesRepository = getRepository(Orphanage)
        const orphanage = await getOrphanagesRepository.findOneOrFail(id, {
            relations: ['images']
        })

        response.status(200).json(orphanageView.render(orphanage))
    },

    async create(request: Request, response: Response){
        const {
            name,
            latitude,
            longitude,
            about,
            instructions,
            opening_hours,
            open_on_weekends
        } = request.body
    

        // console.log(open_on_weekends)

        const getOrphanagesRepository = getRepository(Orphanage)
    
        const requestImages = request.files as Express.Multer.File[]
        const images = requestImages.map(image => {
            return { path: image.filename }
        })

        const data = {
            name,
            latitude,
            longitude,
            about,
            instructions,
            opening_hours,
            open_on_weekends:  open_on_weekends === 'true',
            images
        }

        const schema = Yup.object().shape({
            name: Yup.string().required(),
            latitude: Yup.number().required(),
            longitude: Yup.number().required(),
            about: Yup.string().required().max(300),
            instructions: Yup.string().required(),
            opening_hours: Yup.string().required(),
            open_on_weekends: Yup.boolean().required(),
            images: Yup.array(
                Yup.object().shape({
                    path: Yup.string().required()
            }))

        })

        await schema.validate(data, {
            abortEarly: false
        })

        
        const orphanage = getOrphanagesRepository.create(data)

        // console.log(orphanage)
        
        await getOrphanagesRepository.save(orphanage)
    
        // O codigo 201 significa que algo foi criado
        response.status(201).json(orphanage)
    }
}