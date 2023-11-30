import ActionCreateCard from "@/components/ActionCreateCard";
import ActionInfoCard from "@/components/ActionInfoCard";

const Page = () =>{
    const test =process.env.NEXT_TEST
    return(
        <section>
            <ActionInfoCard />
            <ActionCreateCard />
            {test}
        </section>
    )
}

export default Page;