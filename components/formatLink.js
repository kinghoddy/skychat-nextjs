const formatLink = (body) => {
    if (body) {
        let returnedBody = body;
        let bodyArr = body.split("<br/>").join(' ').split("<div><br></div>").join(' ').split(" ");
        const ident = ["http", "www", ".com", ".ng", ".ga", ".uk", ".net", ".org"];
        bodyArr.forEach((cur) => {
            ident.forEach((el) => {
                if (cur.indexOf(el) > -1) {
                    const link = `<a href=${cur}>${cur}</a>`;
                    returnedBody = body.split(cur).join(link);
                }
            });
        });
        return returnedBody;
    } else {
        return null
    }

};
function linkify(inputText) {
    var replacedText, replacePattern1, replacePattern2, replacePattern3;

    //URLs starting with http://, https://, or ftp://
    replacePattern1 = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
    replacedText = inputText.replace(replacePattern1, '<a href="$1" target="_blank">$1</a>');

    //URLs starting with "www." (without // before it, or it'd re-link the ones done above).
    replacePattern2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
    replacedText = replacedText.replace(replacePattern2, '$1<a href="http://$2" target="_blank">$2</a>');

    //Change email addresses to mailto:: links.
    replacePattern3 = /(([a-zA-Z0-9\-\_\.])+@[a-zA-Z\_]+?(\.[a-zA-Z]{2,6})+)/gim;
    replacedText = replacedText.replace(replacePattern3, '<a href="mailto:$1">$1</a>');

    return replacedText;
}
export default linkify