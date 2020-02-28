import pdfMake from 'pdfmake/build/pdfmake';
import vfsFonts from 'pdfmake/build/vfs_fonts';
import moment from 'moment';
import 'moment/locale/pt-br'; 

import noPhotoDataUri from '../assets/noPhotoDataUri'
import dotToComma from '../utils/dotToComma';
import normalizeCurrency from '../utils/normalizeCurrency';

const normalizeCurrencyDotToComma = value => {
    return normalizeCurrency(dotToComma(value));
}

const Receipt = async _data => {
    const { vfs } = vfsFonts.pdfMake;
    pdfMake.vfs = vfs;

    const contractText = [{ text: '\nCONTRATO DE LOCAÇÃO', fontSize: 18, alignment: 'center' },
        { text: '\n\nPelo presente instrumento particular de Contrato de Locação, que entre si fazem de um lado Wish Locação de Mesas Coloridas & Cia, sediada a Av. Afonso Pena n.45 em Santos/SP, denominada CONTRATADA e de outro lado como CONTRATANTE, conforme os dados citados neste pedido tem justos e contratados o seguinte:\n\n1 - A prestação de serviços trata-se de locação de material para decoração de aniversários, festa em geral e casamentos.\n\n2 - Todo e qualquer item locado e retirado da CONTRATADA, deverá ser conferido no ato da retirada, pois não aceitaremos reclamações posteriores.\n\n3 - O horário de devolução do material é das 13h30 às 17h30, na data constante nesse contrato. Caso ultrapasse, ou o CONTRATANTE que queira prorrogar a data da devolução, a CONTRATADA deverá ser comunicada antecipadamente e será cobrado o aluguel diário das mesmas.\n\n4 - O CONTRATANTE devá deixar um cheque caução, no valor de reposição da peça, de cada item locado, como garantia da mercadoria retirada. AS faltas e avarias dos itens locados deverão ser pagos através do cheque caução ou em dinheiro. Após a verificação dos materiais em perfeito estado o cheque será devolvido ao locatário.\n\nPor estarem justas e contratadas, assinam as duas partes de comum acordo.\n\n', fontSize: 8 },
        { text: 'Santos, 00 de Janeiro de 2020', fontSize: 8 }, '\n\n',
        {
            columns: [
                { text: [{ text: '________________________________________________________', fontSize: 8 }, '\n', { text: 'CONTRATANTE', fontSize: 8 }], alignment: 'center' },
                { text: [{ text: '________________________________________________________', fontSize: 8 }, '\n', { text: 'CONTRATADO', fontSize: 8 }], alignment: 'center' },
            ]
        }, '\n',
        { text: 'Conferido o material\n\nAss.: ________________________________________________________\n\nForma de pagamento: ________________________________________________________\n\nCheque caução: ________________________________________________________\n\nFavor apresentar este para a entrega e retirada do material locado.', fontSize: 8 }
    ]

    var pdf = {
        content: [
            {
                columns: [
                    { width: 150, image: noPhotoDataUri },
                    { width: 270, text: '' },
                    { width: '*', text: ["Nº DO PEDIDO", _data.id], alignment: 'right' },
                ]
            },
            {
                columns: [
                    { text: 'Tel.: (XX) XXXXX-XXXX' },
                ]
            },
            {
                columns: [
                    { text: 'Email: vaneferrareto@hotmail.com' },
                ]
            },
            { canvas: [{ type: 'line', x1: 0, y1: 3, x2: 595 - 2 * 40, y2: 3, lineWidth: 2 }] }, '\n',
            { text: [{ text: 'Nome/Razão Social: ', bold: true }, { text: 'Locação de equipamentos' }] },
            { text: [{ text: 'Endereço: ', bold: true }, { text: 'Av. Pedro Lessa 1670' }] },
            {
                columns: [
                    { text: [{ text: 'Bairro: ', bold: true }, 'Aparecida'] },
                    { text: [{ text: 'Cidade: ', bold: true }, 'Santos'] },
                    { text: [{ text: 'CEP: ', bold: true }, '11020-002'] },
                ]
            },
            {
                columns: [
                    { text: [{ text: 'CPF/CNPJ: ', bold: true }, '000.000.000/0001-00'] },
                    { text: [{ text: 'Telefone: ', bold: true }, '(XX) XXXXX-XXXX'] },
                ]
            },
            { canvas: [{ type: 'line', x1: 0, y1: 5, x2: 595 - 2 * 40, y2: 5, lineWidth: 3 }] },
            '\n',
            {
                columns: [
                    { text: [{ text: 'Data de retirada: ', bold: true }, moment(_data.date_pickup).format('DD/MM/YYYY')] },
                    { text: [{ text: 'Data de devolução: ', bold: true }, moment(_data.date_back).format('DD/MM/YYYY')] },
                ]
            },
            { canvas: [{ type: 'line', x1: 0, y1: 5, x2: 595 - 2 * 40, y2: 5, lineWidth: 3 }] },
            '\n',
            { text: [{ text: 'LISTA DE ITEMS:', bold: true }] },
        ],
        styles: {
            header: {
                fontSize: 18,
                bold: true,
                margin: [0, 0, 0, 10]
            },
            subheader: {
                fontSize: 16,
                bold: true,
                margin: [0, 10, 0, 5]
            },
            tableExample: {
                margin: [0, 5, 0, 15]
            },
            tableHeader: {
                bold: true,
                fontSize: 13,
                color: 'black'
            }
        },
    }

    const table = { widths: ['*', 30, 60, 70, 70] };
    table.body = [];
    table.body.push(
        [
            { text: '', bold: true }, 
            { text: 'Qnt.', bold: true }, 
            { text: 'Preço unit. (R$)', bold: true }, 
            { text: 'Total (R$)', bold: true }, 
            { text: 'Reposição (R$)', bold: true }
        ]
    );

    for (let i = 0; i < _data.order_items.length; i++) {
        let item = _data.order_items[i];
        table.body.push(
            [
                { text: item.item.name }, 
                { text: item.quantity, alignment: 'right' }, 
                { text: normalizeCurrencyDotToComma(item.value), alignment: 'right' }, 
                { text: normalizeCurrencyDotToComma(item.value * item.quantity), alignment: 'right' }, 
                { text: normalizeCurrencyDotToComma(item.value_repo), alignment: 'right' }
            ]
        );
    }

    table.body.push(
        [
            '', 
            '', 
            { text: 'Desconto:', bold: true }, 
            { text: normalizeCurrencyDotToComma(_data.discount), bold: true, alignment: 'right' }, 
            ''
        ],
        [
            '',
            '',
            { text: 'Total:', bold: true },
            { text: normalizeCurrencyDotToComma(_data.total), bold: true, alignment: 'right' },
            ''
        ]
    );

    pdf.content.push({ table });
    pdf.content.push(contractText);

    // pdfMake.createPdf(pdf).download('pedido.pdf');
    pdfMake.createPdf(pdf).open();
}

export default Receipt;
