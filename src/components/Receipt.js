import pdfMake from 'pdfmake/build/pdfmake';
import vfsFonts from 'pdfmake/build/vfs_fonts';
import moment from 'moment';
import 'moment/locale/pt-br'; 

import dotToComma from '../utils/dotToComma';
import normalizeCurrency from '../utils/normalizeCurrency';
import api from '../services/api';
import { getAuth } from '../services/auth';

const normalizeCurrencyDotToComma = value => {
    return normalizeCurrency(dotToComma(value));
}

const Receipt = async _data => {
    const auth = getAuth();
    const response = await api.get('/auth/me',
        {
            headers: {
                Authorization: 'Bearer ' + (auth ? auth.token : '')
            }
        }
    );
    if (response.status !== 200) return;

    const { email, social_name, fantasy_name, phone, doc, logo, zip, address, neighborhood, city, state } = response.data;
    const completeDate = moment(_data.date_pickup).format('D [de] MMMM [de] YYYY')
    const { vfs } = vfsFonts.pdfMake;
    pdfMake.vfs = vfs;

    const contractText = [{ text: '\nCONTRATO DE LOCAÇÃO', fontSize: 18, alignment: 'center' },
        { text: `
        
        Pelo presente instrumento particular de Contrato de Locação, que entre si fazem de um lado ${fantasy_name}, sediada a ${address} em ${city}/${state}, denominada CONTRATADA e de outro lado como CONTRATANTE, conforme os dados citados neste pedido tem justos e contratados o seguinte:
        
        1 - A prestação de serviços trata-se de locação de material para decoração de aniversários, festa em geral e casamentos.
        
        2 - Todo e qualquer item locado e retirado da CONTRATADA, deverá ser conferido no ato da retirada, pois não aceitaremos reclamações posteriores.
        
        3 - O horário de devolução do material é das 13h30 às 17h30, na data constante nesse contrato. Caso ultrapasse, ou o CONTRATANTE que queira prorrogar a data da devolução, a CONTRATADA deverá ser comunicada antecipadamente e será cobrado o aluguel diário das mesmas.
        
        4 - O CONTRATANTE devá deixar um cheque caução, no valor de reposição da peça, de cada item locado, como garantia da mercadoria retirada. AS faltas e avarias dos itens locados deverão ser pagos através do cheque caução ou em dinheiro. Após a verificação dos materiais em perfeito estado o cheque será devolvido ao locatário.
        
        Por estarem justas e contratadas, assinam as duas partes de comum acordo.
        
        `, fontSize: 8 },
        { text: `${city}, ${completeDate}`, fontSize: 8 }, '\n\n',
        {
            columns: [
                { text: [{ text: '________________________________________________________', fontSize: 8 }, '\n', { text: 'CONTRATANTE', fontSize: 8 }], alignment: 'center' },
                { text: [{ text: '________________________________________________________', fontSize: 8 }, '\n', { text: 'CONTRATADO', fontSize: 8 }], alignment: 'center' },
            ]
        }, '\n',
        { text: 'Conferido o material\n\nAss.: ________________________________________________________\n\nForma de pagamento: ________________________________________________________\n\nCheque caução: ________________________________________________________\n\nFavor apresentar este para a entrega e retirada do material locado.', fontSize: 8 }
    ]

    var pdf = {
        pageMargins: 20,
        content: [
            {
                table: {
                    widths: [
                        "*",
                        100
                    ],
                    body: [
                        [
                            {
                                columns: [
                                    { width: 100, image: logo },
                                    { width: 10, text: ''},
                                    [
                                        {
                                            text: 'CONTRATANTE:',
                                            fontSize: 8,
                                            bold: true,
                                        },
                                        {
                                            text: `${fantasy_name}`,
                                            fontSize: 8
                                        },
                                        {
                                            text: `Razão Social: ${social_name}`,
                                            fontSize: 8
                                        },
                                        {
                                            text: `CPNJ: ${doc}`,
                                            fontSize: 8
                                        },
                                        {
                                            text: `Telefone: ${phone}`,
                                            fontSize: 8
                                        },
                                        {
                                            text: `Email: ${email}`,
                                            fontSize: 8
                                        },
                                        {
                                            text: `Endereço: ${address}`,
                                            fontSize: 8
                                        },
                                        {
                                            text: `Bairro: ${neighborhood}`,
                                            fontSize: 8
                                        },
                                        {
                                            text: `Cidade: ${city}-${state}`,
                                            fontSize: 8
                                        },
                                        {
                                            text: `CEP: ${zip}`,
                                            fontSize: 8
                                        },
                                    ]
                                ]
                            },
                            [
                                {
                                    text:  "Nº DO PEDIDO",
                                    alignment: "center"
                                },
                                {
                                    text: _data.idn,
                                    alignment: "center",
                                    fontSize: 20
                                },
                            ]
                        ]
                    ]
                }
            },
            { canvas: [{ type: 'line', x1: 0, y1: 3, x2: 635 - 2 * 40, y2: 3, lineWidth: 2 }] }, '\n',
            {  text: 'Contratante: ', bold: true, alignment: 'center', fontSize: 12 },
            { canvas: [{ type: 'line', x1: 0, y1: 3, x2: 635 - 2 * 40, y2: 3, lineWidth: 2 }] }, '\n',

            { text: [{ text: 'Nome/Razão Social: ', bold: true }, { text: _data.customer.name }] },
            { text: [{ text: 'Endereço: ', bold: true }, { text: _data.customer.address }] },
            {
                columns: [
                    { text: [{ text: 'Bairro: ', bold: true }, _data.customer.neighborhood] },
                    { text: [{ text: 'Cidade: ', bold: true }, _data.customer.city + '-' + _data.customer.state] },
                    { text: [{ text: 'CEP: ', bold: true }, _data.customer.zip] },
                ]
            },
            {
                columns: [
                    { text: [{ text: 'CPF/CNPJ: ', bold: true }, _data.customer.doc] },
                    { text: [{ text: 'Telefone: ', bold: true }, _data.customer.phone] },
                ]
            },
            { canvas: [{ type: 'line', x1: 0, y1: 5, x2: 635 - 2 * 40, y2: 5, lineWidth: 3 }] },
            '\n',
            {
                columns: [
                    { text: [{ text: 'Data de retirada: ', bold: true }, moment(_data.date_pickup).format('DD/MM/YYYY')] },
                    { text: [{ text: 'Data de devolução: ', bold: true }, moment(_data.date_back).format('DD/MM/YYYY')] },
                ]
            },
            { canvas: [{ type: 'line', x1: 0, y1: 5, x2: 635 - 2 * 40, y2: 5, lineWidth: 3 }] },
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
                { text: (i + 1) + ' - ' + item.item.name + ' - ' + item.item.idn }, 
                { text: item.quantity, alignment: 'right' }, 
                { text: normalizeCurrencyDotToComma(item.value), alignment: 'right' }, 
                { text: normalizeCurrencyDotToComma(item.value * item.quantity), alignment: 'right' }, 
                { text: normalizeCurrencyDotToComma(item.value_repo), alignment: 'right' }
            ]
        );
    }

    if (_data.discount && _data.discount > 0 )
        table.body.push(
            [
                '', 
                '', 
                { text: 'Desconto:', bold: true }, 
                { text: normalizeCurrencyDotToComma(_data.discount), bold: true, alignment: 'right' }, 
                ''
            ]
        );

    table.body.push(
        [
            '',
            '',
            { text: 'Total:', bold: true },
            { text: normalizeCurrencyDotToComma(_data.total), bold: true, alignment: 'right' },
            ''
        ]
    );

    pdf.content.push({ table });
    pdf.content.push({ text: '', pageBreak: 'after' });
    pdf.content.push(contractText);
    // console.log(JSON.stringify(pdf));
    // pdfMake.createPdf(pdf).open();
    pdfMake.createPdf(pdf).download('pedido.pdf');
}

export default Receipt;
