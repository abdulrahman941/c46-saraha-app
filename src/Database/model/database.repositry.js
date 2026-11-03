
export const findOne=async({model,filter={},select="",options={}})=>{
const doc=model.findOne(filter)
if(select.length) doc.select(select)
if(options.populate) doc.populate(options.populate)
if(options.lean) doc.lean()
    return await doc.exec()
}


export const create=async({model={},data, options={validateBeforeSave:true}})=>{
return await model.create(data)
}

export const createOne=async({model={},data, options={validateBeforeSave:true}})=>{
const [doc]=(await model.create(data)) ||[]
return doc
}

export const findById=async({model,id,select="",options={}})=>{
const doc=model.findOne(id)
if(select.length) doc.select(select)
if(options.populate) doc.populate(options.populate)
if(options.lean) doc.lean()
    return await doc.exec()
}
export const find=async({model,filter={},select="",options={}})=>{
const doc=model.find(filter)
if(select.length) doc.select(select)
if(options.populate) doc.populate(options.populate)
if(options.lean) doc.lean()
if(options?.limit) doc.limit(options.limit)
if(options?.skip) doc.skip(options.skip)
    return await doc.exec()
}

export const insertMany=async({model={},data,options={}})=>{
return await model.insertMany(data,options)
}

export const updateOne=async({model,filter,update,options={}})=>{
const doc=model.updateOne(filter,{...update, $inc:{_v:1}},options)
    return await doc.exec()
}

export const findOneAndUpdate=async({model,filter,update,options={}})=>{
const doc=model.findOneAndUpdate(filter,{...update, $inc:{_v:1}},{...options,new:true,runValidators:true})
    return await doc.exec()
}

export const findByIdAndUpdate=async({model,id,update,options={}})=>{
const doc=model.findByIdAndUpdate(id,{...update, $inc:{_v:1}},{...options,new:true,runValidators:true})
    return await doc.exec()
}

export const deleteOne=async({model,filter}={})=>{
    return await model.deleteOne(filter)
}

export const findOneAndDelete=async({model,filter}={})=>{
    return await model.findOneAndDelete(filter)
}