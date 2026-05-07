import bcrypt from 'bcryptjs'

export const hash = ({inputData , round = process.env.ROUND} = {}) =>{
    const hashResult = bcrypt.hashSync(inputData,parseInt(round))
    return hashResult
}


export const compare = ({inputData , hashValue} = {}) =>{
    const match = bcrypt.compareSync(inputData,hashValue)
    return match
}
