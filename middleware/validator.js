import * as yup from 'yup'

export const validate = (schema) => {
    return async (req,res,next) => {
        if (!req.body) return res.status(422).json({error: "Request does not contain the expected value"})

       const schemaToValidate = yup.object({
            body: schema
        });

        try{
            await schemaToValidate.validate({
                body:req.body
            }, {
                abortEarly: true
            })

            next()
        }catch(err){
            if(err instanceof yup.ValidationError){
                res.status(422).json({message: err.message})
            }
        }
    }
}