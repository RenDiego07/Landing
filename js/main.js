const databaseURL = 'https://jmdiego-5c19d-default-rtdb.firebaseio.com/requests.json';
let sendData = () => { 
    // Obtén los datos del formulario
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries()); // Convierte FormData a objeto
    
    // new Date().toLocaleString( locales, options )
    data['saved'] = new Date().toLocaleString('es-CO', { timeZone: 'America/Guayaquil' })
    
    // Realiza la petición POST con fetch
    fetch(databaseURL, {
        method: 'POST', // Método de la solicitud
        headers: {
            'Content-Type': 'application/json' // Especifica que los datos están en formato JSON
        },
        //Serializar(convertir a texto)
        body: JSON.stringify(data) // Convierte los datos a JSON
    })
    .then(response => {
        if (!response.ok) {

        }
        //Deserializar convertir el texto al objeto
        return response.json(); // Procesa la respuesta como JSON
    })
    .then(result => {
        alert('Agradeciendo tu preferencia, nos mantenemos actualizados y enfocados en atenderte como mereces'); // Maneja la respuesta con un mensaje
        form.reset()//hace que desparezcan los datos cada vez que se envian 
        getData();
    })
    .catch(error => {
        alert('Hemos experimentado un error. ¡Vuelve pronto!'); // Maneja el error con un mensaje
    });
 }

let ready = () => {
    console.log('DOM está listo')
    getData();
}

let loaded = () => {
    console.log('Iframes e Images cargadas')
    let myform = document.getElementById('form');
    myform.addEventListener('submit',(eventSubmit)=>{
        eventSubmit.preventDefault();
        //me regresa el cursor dentro del input
        const emailElement = document.querySelector('.form-control-lg');
        const emailText = emailElement.value;

        if (emailText.length === 0) {
          emailElement.focus()

          emailElement.animate(
            [
                { transform: "translateX(0)" },
                { transform: "translateX(50px)" },
                { transform: "translateX(-50px)" },
                { transform: "translateX(0)" }
            ],
            {
                duration: 400,
                easing: "linear",
            }
        )
        return;

        }
        sendData();
    });
}


let getData = async () => {
    const suscribers = document.getElementById('subscribers');
    
        try{
            const jData = await fetch(databaseURL, {
                    method: 'GET'
            });
            // verificar la respuesta del servidor
            if(!jData.ok){
                throw new Error(`Response ${jData.status}`)
            }
            const data = await jData.json();
            const dic = new Map();
            if(data !=null){
                for( const key in data){
                    const {email, saved} = data[key];
                    const date_format = saved.split(",");
                    const date = date_format[0]; 
                    if(dic.has(date)){
                        dic.set(date, dic.get(date)+1);
                    }else{
                        dic.set(date, 1)
                    }
                }
            }


            if(dic.size > 0){
                suscribers.innerHTML = '';
                let index = 1;
                for(let [key,count] of dic){
                    let template = `
                        <tr>
                            <th>${index}</th>
                            <td>${key}</td>
                            <td>${count}</td>
                        </tr>
                    `
                    suscribers.innerHTML+= template;
                    index++;
                }
            }        
        }catch(error){
            console.error(error.message);
        }
}




window.addEventListener("DOMContentLoaded", ready);

window.addEventListener("load", loaded);