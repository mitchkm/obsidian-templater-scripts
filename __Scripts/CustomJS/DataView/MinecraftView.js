class MinecraftView {

    getMods() {
        return new this.Query(DataviewAPI).getMinecraftEntries("mod");
    }

    getResourcePacks() {
        return new this.Query(DataviewAPI).getMinecraftEntries("resourcepack");
    }

    getDataPacks() {
        return new this.Query(DataviewAPI).getMinecraftEntries("datapack");
    }

    getShaders() {
        return new this.Query(DataviewAPI).getMinecraftEntries("shader");
    }

    Query = class MCQuery {
        constructor(dv) {
            this.dv = dv;
            this.pages;
        }

        getMinecraftEntries(prjType) {
            this.pages = this.dv.pages(`#minecraft/${prjType ? prjType : ""}`);
            this.pages = this.pages?.where(m => m != null);
            return this;
        }

        withType(type) {
            this.pages = this.pages?.where(m => m.type === type);
            return this;
        }
    }
}