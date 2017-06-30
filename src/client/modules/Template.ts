export class Template {
    public static getUrl(id: string) {
        require(`./${id}.pug`);
        return `/tpl/${id}.html`;
    }
}
