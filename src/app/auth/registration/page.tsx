import FaultForm from "@/components/auth/faultForm";
import RegForm from "@/components/auth/regfrom";
import RegistrationForm from "@/components/auth/registrationform";
import FileUploader from "@/components/FileUploader";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
{
  /* <div>
      <RegistrationForm />
    </div> */
}
function page() {
  return (
    <Tabs
      defaultValue="connection"
      className="bg-transparent w-full md:w-[75%] md:mx-auto md:justify-center md:items-center  md:shadow-lg m-4 md:my-0"
    >
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="connection">Connections</TabsTrigger>
        <TabsTrigger value="fault">Faults</TabsTrigger>
      </TabsList>
      <TabsContent value="connection">
        <Card>
          <CardHeader>
            <CardTitle>Project Material Supply</CardTitle>
            <CardDescription>
              Create account with a project number (PJOB)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <RegForm />
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="fault">
        <Card>
          <CardHeader>
            <CardTitle>Fault Material Supply</CardTitle>
            <CardDescription>
              Create account with a fault number.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <FaultForm />
           
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}

export default page;
