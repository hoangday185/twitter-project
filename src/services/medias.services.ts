import { Request } from 'express'
import sharp from 'sharp'
import { UPLOAD_IMAGE_DIR } from '~/constants/dir'
import { getNameFromFullname, handleUploadImage, handleUploadVideo } from '~/utils/file'
import fs from 'fs'
import { envConfig, isProduction } from '~/constants/config'
import { MediaType } from '~/constants/enums'
import { Media } from '~/models/Other'
import { config } from 'dotenv'
config()
class MediasService {
  async uploadImage(req: Request) {
    const files = await handleUploadImage(req) //handleUploadImage giờ trả ra mảng các file

    const result: Media[] = await Promise.all(
      files.map(async (file) => {
        //files.map return về mảng các promise
        //xử lý từng file một, mà có Promisea.all sẽ xử lý song song=> nhanh hơn
        //xử lý file bằng sharp
        ////filepath là đường của file cần xử lý đang nằm trong uploads/temp
        //file.newFilename: là tên unique mới của file sau khi upload lên, ta xóa đuôi và thêm jpg
        const newFilename = getNameFromFullname(file.newFilename) + '.jpg'
        const newPath = UPLOAD_IMAGE_DIR + '/' + newFilename //đường dẫn mới của file sau khi xử lý
        const info = await sharp(file.filepath).jpeg().toFile(newPath)
        fs.unlinkSync(file.filepath) //xóa file cũ đi
        //cữ mỗi file sẽ biến thành object chứa thông tin của file
        //để ý url, vì ta đã thêm /image/ để đúng với route đã viết ở Serving static file
        return {
          url: isProduction
            ? `${envConfig.port}/static/image/${newFilename}`
            : `http://localhost:${envConfig.port}/static/image/${newFilename}`,
          type: MediaType.Image
        }
      })
    )
    return result
  }

  async uploadVideo(req: Request) {
    const files = await handleUploadVideo(req)
    const { newFilename } = files[0]
    return {
      url: isProduction
        ? `${envConfig.port}/static/video-stream/${newFilename}`
        : `http://localhost:${envConfig.port}/static/video-stream/${newFilename}`,
      type: MediaType.Video
    }
  }
}

const mediasService = new MediasService()

export default mediasService
