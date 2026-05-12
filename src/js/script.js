// DECLARAÇÕES DOS ELEMENTOS USANDO DOM(DOCUMENT OBEJECT MODEL)

const videoELemento = document.getElementById("video");
const botaoScanear = document.getElementById("btn-texto");
const resultado = document.getElementById("saida");
const canvas = document.getElementById("canvas");

//FUNÇÃO PARA HABILITAR A CÂMERA

async function configurarCamera() {
    try{
        const midia = await navigator.mediaDevices.getUserMedia({
            video:{facingMode: "environment"},//habilitando a camera traseira
            audio: false
        })
        videoELemento.srcObject = midia;
        videoELemento.play(); // garante que o video comece
    }catch(erro){
        resultado.innerText="Erro ao acessar a câmera ", erro;
    }
}

configurarCamera();

//Fução para ler o texto da imagem e mostrar na tela

botaoScanear.onclick = async()=>{
    botaoScanear.disable = true;
    resultado.innerText = "Fazendo a leitura...aguarde";

    // chama a estrutura do canvas
    const context = canvas.getContext("2d");

    //ajusta o tamanho da tela do vídeo
    canvas.width = videoElemento.videoWidth; // largura
    canvas.height = videoElemento.videoHeight; ; //altura

    //reset de qualquer transformação para garantir que a foto não fique invertida
    context.setTransform(1,0,1,0,0);

    //Aplica o filtro de contraste e escala de cinza no canvas antes de tirar a foto (ajuda a evitar letras aleatórias)
    context.filter = 'contrast(1.2) grayscale(1)';

    //construindo a tela para tirar a foto
    context.drawImage(videoElemento, 0,0, canvas.width, canvas.height);
    try{
        const {data:{ text }} = await Tesseract.recognize(
            canvas,
            'por'
        );
        //remove espaços excessivos e caracteres especiais
        const textoFinal = text.trim();
        
        resultado.innerText = textoFinal.length > 0 ? textoFinal : "Não foi possível identificar o texto";
    }catch(erro){
        console.error(erro);
        resultado.innerText="Erro ao processar", erro;
    }finally{
        //Desabilita o botão para começar nova leitura
    }
}