
function formatLink(inputText) {
    var replacedText, replacePattern1, replacePattern2, replacePattern3, replacePattern4;

    //URLs starting with http://, https://, or ftp://
    replacePattern1 = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
    replacedText = inputText.replace(replacePattern1, '<a class="inLink" href="$1" target="_blank">$1</a>');

    //URLs starting with "www." (without // before it, or it'd re-link the ones done above).
    replacePattern2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
    replacedText = replacedText.replace(replacePattern2, '$1<a class="inLink" href="http://$2" target="_blank">$2</a>');

    //Change email addresses to mailto:: links.
    replacePattern3 = /(([a-zA-Z0-9\-\_\.])+@[a-zA-Z\_]+?(\.[a-zA-Z]{2,6})+)/gim;
    replacedText = replacedText.replace(replacePattern3, '<a class="inLink" href="mailto:$1">$1</a>');

    replacePattern4 = /(^|[^@\w])@(\w{1,15})\b/g;
    replacedText = replacedText.replace(replacePattern4, '$1<a class="inLink" href="/$2">@$2</a>')

    return replacedText;
}
export default formatLink