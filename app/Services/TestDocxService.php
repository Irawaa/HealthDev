<?php

namespace App\Services;

use PhpOffice\PhpWord\TemplateProcessor;
use PhpOffice\PhpWord\Shared\Converter;
use PhpOffice\PhpWord\PhpWord;
use PhpOffice\PhpWord\Element\Shape;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Log;

class TestDocxService
{
    public static function generateDocx()
    {
        // Path to the template file (ensure test_template.docx exists)
        $templatePath = storage_path('app/templates/test_template.docx');
        $storageDir = storage_path('app/generated');
        
        // Ensure "generated" directory exists
        if (!File::exists($storageDir)) {
            File::makeDirectory($storageDir, 0755, true, true);
        }

        // Check if the template exists
        if (!File::exists($templatePath)) {
            Log::error("DOCX template not found", ['path' => $templatePath]);
            throw new \Exception("Template file not found at: {$templatePath}");
        }

        // Prepare dynamic data
        $data = [
            'name' => 'John Doe',
            'date' => now()->format('Y-m-d'),
        ];

        // Output path for the generated DOCX
        $outputPath = "{$storageDir}/test_generated_" . now()->format('Ymd_His') . '.docx';

        // Create a TemplateProcessor instance with the template file
        $templateProcessor = new TemplateProcessor($templatePath);

        // Replace text placeholders with dynamic data
        $templateProcessor->setValue('name', $data['name']);
        $templateProcessor->setValue('date', $data['date']);

        // Replace ${circle_box} placeholder with the circle
        self::replaceCircleBox($templateProcessor);

        // Save the modified DOCX
        $templateProcessor->saveAs($outputPath);

        // Log the success
        Log::info("DOCX file generated successfully", ['file_path' => $outputPath]);

        return $outputPath;
    }

    private static function replaceCircleBox($templateProcessor)
    {
        // This method replaces the ${circle_box} placeholder with a circle
        $section = $templateProcessor->getSection();

        // Add the circle shape (using the oval shape)
        self::addCircle($section);
    }

    private static function addCircle($section)
    {
        // Add a circle shape (Oval shape with equal width and height)
        $section->addShape(
            'oval',
            [
                'frame' => ['width' => 100, 'height' => 100], // 100x100 makes it a circle
                'fill' => ['color' => '#FFFFFF'], // Circle fill color (white)
                'outline' => ['color' => '#000000', 'weight' => 1], // Circle outline color and width
            ]
        );
    }
}
