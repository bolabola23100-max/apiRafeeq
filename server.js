const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// قراءة ملف الحيوان
function readAnimalFile(animalName) {
  try {
    const filePath = path.join(__dirname, "data", `${animalName}.json`);
    const data = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    return null;
  }
}

// كل الحيوانات
app.get("/animals", (req, res) => {
  try {
    const files = fs.readdirSync(path.join(__dirname, "data"));
    const animals = files.map((f) => f.replace(".json", ""));
    res.json({ success: true, animals });
  } catch {
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// فصائل الحيوان
app.get("/animals/:animal", (req, res) => {
  const animal = req.params.animal.toLowerCase();
  const data = readAnimalFile(animal);

  if (!data)
    return res
      .status(404)
      .json({ success: false, message: "Animal not found" });

  // ✅ رجّع كل البيانات مش الاسم بس
  res.json({ success: true, animal, breeds: data.breeds });
});

// معلومات الفصيلة
app.get("/animals/:animal/:breed", (req, res) => {
  const animal = req.params.animal.toLowerCase();
  const breed = req.params.breed.toLowerCase();

  const data = readAnimalFile(animal);
  if (!data)
    return res
      .status(404)
      .json({ success: false, message: "Animal not found" });

  const breedData = data.breeds.find((b) => b.name_en.toLowerCase() === breed);

  if (!breedData)
    return res.status(404).json({ success: false, message: "Breed not found" });

  res.json({ success: true, data: breedData });
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
