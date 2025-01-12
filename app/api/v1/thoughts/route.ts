import { thoughtSchema } from "@/schema";
import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

export const POST = async (req: NextRequest) => {
    try {
        const supabase = await createClient();
        
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }


        const formData = await req.formData();
        const title = formData.get('title') as string;
        const thoughts = formData.get('thoughts') as string;
        const imageFile = formData.get('image') as File;


        thoughtSchema.parse({ title, thoughts });

        let imageUrl = '';
        

        if (imageFile) {

            const bytes = await imageFile.arrayBuffer();
            const buffer = Buffer.from(bytes);
            const base64Image = `data:${imageFile.type};base64,${buffer.toString('base64')}`;


            const uploadResponse = await cloudinary.uploader.upload(base64Image, {
                folder: 'thoughts', 
            });
            
            imageUrl = uploadResponse.secure_url;
        }


        const { data, error } = await supabase
            .from("thoughts")
            .insert([
                {
                    title,
                    thoughts,
                    img: imageUrl, 
                    user_id: user.id
                }
            ])
            .select()
            .single();

        if (error) {
            return NextResponse.json({ message: error.message }, { status: 400 });
        }

        return NextResponse.json(data, { status: 200 });

    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ error }, { status: 400 });
    }
}

export const GET = async (req:NextRequest) => {
    try {
        const supabase = await createClient();
        
        const { data: { user } } = await supabase.auth.getUser()
        if(!user) {
            return NextResponse.json({message:"Unauthorized"}, {status: 401})
    
        }
        const {data, error} = await supabase.from("thoughts").select().eq("user_id", user.id);
        if(error) {
            return NextResponse.json({message:error.message}, {status: 400})
        }
    
        return NextResponse.json(data,{status: 200})
    
    } catch (error) {
        return NextResponse.json({error}, {status: 400})
    }
}
