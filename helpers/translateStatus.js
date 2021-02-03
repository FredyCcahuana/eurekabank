module.exports =(status)=>{
    if(status.localeCompare('assigned')===0){
        return 'Asignado'
    }
    if(status.localeCompare('cancelled')===0){
        return 'Anulado'
    }
    if(status.localeCompare('finished')===0){
        return 'Finalizado'
    }
    if(status.localeCompare('in-attention')===0){
        return 'En Atención'
    }
    if(status.localeCompare('in-place'===0)){
        return 'En el Lugar'
    }
    if(status.localeCompare('no-finished')===0){
        return 'Asistido no Realizado'
    } 
    if(status.localeCompare('pending')===0){
        return 'Pendiente'
    } 
    if(status == 's_cancelled'){
        return 'Servicio Cancelado'
    }
    if(status == 's_rejected'){
        return 'Servicio Rechazado'
    }
}


