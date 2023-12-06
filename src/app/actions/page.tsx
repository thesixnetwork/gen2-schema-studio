import ActionCreateCard from "@/components/ActionCreateCard";
import ActionInfoCard from "@/components/ActionInfoCard";
import ActionInput from "@/components/ActionInput";
import ActionInputThenWhen from "@/components/ActionInputThenWhen";

const Page = () =>{
    const test =process.env.NEXT_TEST
    return(
        <section>
            <ActionInfoCard name="test" description="mockkrub" when="meta.GetBoolean(‘checked_in’) == false && meta.GetString(‘tier’) != ‘staff’" then=""/>
            <ActionCreateCard />
            {test}
        </section>
    )
}

export default Page;