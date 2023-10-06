// RECUPERA LOS ELEMENTOS DEL DOM
const montoEnCLP = document.querySelector("#montoEnCLP");
const tiposMoneda = document.querySelector("#tiposMoneda");
const traeValorMoneda = document.querySelector("#traeValorMoneda");
const resultadoConversion = document.querySelector("#resultadoConversion");
const chartDOM = document.getElementById("myChart");
const divGrafica = document.querySelector(".grafica")



//variable que se utiliza para saber si el grafico ya fue creado
var myChart;

// ESCUCHA EL ENVENTO CLICK DEL BOTON
traeValorMoneda.addEventListener("click",()=> {
    if(montoEnCLP.value.trim()=="" || Number(montoEnCLP.value)==0){
        alert("Debe ingresar un monto")
    }
    else if(tiposMoneda.value=="sel"){
        alert("Debe seleccionar una moneda")
    }
    else{
        getValorMoneda()
        divGrafica.style.backgroundColor = "white";
    }
})

// consume la API con el endpoint del tipo de moneda seleccionado
async function getValorMoneda(){
    try {
        const res = await fetch("https://mindicador.cl/api/" + tiposMoneda.value);
        const data = await res.json();
        const {serie} = data; //recupera la propiedad serie con destructuración y se asigna en la variable serie

        // realiza la conversión del monto con la variación mas reciente de la moneda seleccionada
        resultadoConversion.innerHTML = "Resultado Conversión: $" + (Number(montoEnCLP.value) / Number(serie[0].valor)).toFixed(2);

        // verifica si el grafico ya fue creado, de ser así, lo destruye para volver a crearlo
        if (myChart) {
            myChart.destroy();
        }
        
        // crea el grafico con los valores de la moneda seleccionada
        myChart = new Chart(chartDOM, generaDatosGrafico(serie));

    } catch (e) {
        resultadoConversion.innerHTML = `Ha ocurrido el siguiente error en la función getValorMoneda:<br>${e.message}` 
    }
}

function generaDatosGrafico(arrSeries){
    let config;
    try {
        const labels = arrSeries.map((serie) => {
            return new Date(serie.fecha).toLocaleDateString('es-cl', { year: "numeric", month: "numeric", day: "numeric" });
        });
    
        const labelsValores = arrSeries.map((serie) => {
            return Number(serie.valor)
        });
    
        // Deja solo los primeros objetos
        labels.splice(10, labels.length);
        labelsValores.splice(10, labelsValores.length);
    
        // Crea el objeto que contendrá la información del grafico
        config = {
            type: "line",
            data: {
                labels: labels.reverse(),
                datasets: [{
                    label: "Variación de la moneda:" + tiposMoneda.value,
                    backgroundColor: "blue",
                    data: labelsValores.reverse()
                }]
            }
        };
        return config;
    } catch (e) {
        resultadoConversion.innerHTML = `Ha ocurrido el siguiente error en la función generaDatosGrafico:<br>${e.message}`
    }
    
}






