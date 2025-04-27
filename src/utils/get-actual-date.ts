export function getActualDate(): string {
    const date = new Date();
    const options = { timeZone: "America/Sao_Paulo" };
    const dateInSaoPaulo = date.toLocaleDateString("pt-BR", options);
    const [day, month, year] = dateInSaoPaulo.split("/");
    const formattedDate = `${year}-${month}-${day}`;

    return formattedDate;
}
