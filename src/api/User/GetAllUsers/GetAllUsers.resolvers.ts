import { Query, Resolver, UseMiddleware } from "type-graphql";
import { User } from "../../../entity/User";
import { isAuth } from "../../../middleware/isAuthenticated";

@Resolver()
export class GetAllUsersResolvers{
    @Query(()=>[User])
    @UseMiddleware(isAuth)
    async getAllUsers(){
        return await User.find()
    }

}
