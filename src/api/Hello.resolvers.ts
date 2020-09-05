import { Query, Resolver } from "type-graphql";

@Resolver()
export class HelloResolvers {
    @Query(() => String)
    async hello() {
        return "Hello World Alpha";
    }
}
