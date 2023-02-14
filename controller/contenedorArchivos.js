const fs=require('fs')
class ContenedorArchivo{
    constructor(archivo){
        this.archivo=`./${archivo}.txt`
        this.id=1
        //this.timestamp=new Date().toLocaleString()
        fs.writeFileSync(`./${archivo}.txt`,"[]")
    }

    save=async(object)=>{
        //traer el contenido del archivo y preguntar si tiene algo,si no se pone objet id en 1
        //si hay contenido se recorre y se guarda el id del ultimo y se le suma uno y al objeto.id se le asigna lo guardado
       let path=this.archivo
    
            try{
                const contenido= await fs.promises.readFile(path,'utf-8')
              
                let info =JSON.parse(contenido)
                let idReturn= this.id    
                object.id=this.id
                //object.timestamp=this.timestamp
                info.push(object)
                fs.writeFileSync(path,JSON.stringify(info,null,2))
                this.id++
                return idReturn
            }
            catch(err){
                console.log("error de lectura",err)
            }  
    }
    getbyid= async(number)=>{
        let resultado=null
        
              const contenido= await fs.promises.readFile(this.archivo,'utf-8')
              let bandera=0
              let info= JSON.parse(contenido)
              for(let i = 0;i <info.length;i++){
              if (info[i].id==number){
                  resultado = info[i]
                  
                  bandera=1
                    }  } 
              if (bandera===0){
                  resultado=null
                    
              }
              
           return resultado
    }//funciona
    getAll=async()=>{
        
      const contenido= await fs.promises.readFile(this.archivo,'utf-8')
      let info=JSON.parse(contenido)
      
      
      return info
    }//funciona
    deleteById(number){
        let info=""
        
        fs.readFile(this.archivo,'utf-8',(error,contenido)=>{
            if (error){
                console.log("no se pudo leer el archivo")
            }else{
                info =JSON.parse(contenido)
                console.log(info)
                let bandera=-1
                for(let i = 0;i <info.length;i++){
                    if (info[i].id===number){
                        info.splice(i,1)
                        bandera=1
                        fs.writeFileSync(this.archivo,JSON.stringify(info,null,2))
                        console.log(info)
                          }
                } if (bandera===-1){
                    console.log("el elemento no se encuentra en el archivo")
                    }
            }
        }) 
    }//funciona
    deleteAll(){
        fs.readFile(this.archivo,'utf-8',(error,contenido)=>{
            if (error){
                console.log("no se pudo leer el archivo")
            }else{ 
               let info =JSON.parse(contenido)
               console.log(info)
                info.splice(0,info.length)
                fs.writeFileSync(this.archivo,JSON.stringify(info,null,2))
                console.log(info)
            }
        })
    }//funciona

}
module.exports={ContenedorArchivo}