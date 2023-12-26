

export async function GET(
  request: Request, 
  { params }: { params: { schemacode: string } }
  ) {


  console.log(JSON.stringify(request.url,null,2));
  // console.log(request.);
  // console.log(params.schemacode);

  return Response.json({message: "message"});
}