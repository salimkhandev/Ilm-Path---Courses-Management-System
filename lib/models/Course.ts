import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IVideo {
  _id: mongoose.Types.ObjectId;
  order: number;
  title: string;
  duration: number;   // seconds
  r2Key: string;
  sizeBytes: number;
}

export interface ICourse extends Document {
  title: string;
  description: string;
  thumbnailKey: string;  // R2 object key — never a full URL
  videos: IVideo[];
  createdAt: Date;
  updatedAt: Date;
}

const VideoSchema = new Schema<IVideo>(
  {
    order: { type: Number, required: true },
    title: { type: String, required: true, trim: true },
    duration: { type: Number, required: true },
    r2Key: { type: String, required: true },
    sizeBytes: { type: Number, required: true },
  },
  { _id: true }
);

const CourseSchema = new Schema<ICourse>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    thumbnailKey: { type: String, required: true },
    videos: { type: [VideoSchema], default: [] },
  },
  { timestamps: true }
);

const Course: Model<ICourse> =
  mongoose.models.Course ?? mongoose.model<ICourse>('Course', CourseSchema);

export default Course;
